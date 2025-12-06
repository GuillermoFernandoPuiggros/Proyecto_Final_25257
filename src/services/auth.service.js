import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../data/data.js";
import { generateToken } from "../jwt/jwt.js";
import { userModel } from "../models/user.model.js";
import { collection, getDocs } from "firebase/firestore";

// Función auxiliar para asegurar usuario en Firestore (CORREGIDA)
async function ensureUserInFirestore(user, role = 'user') {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      nombre: user.displayName || user.email.split('@')[0],
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime,
      lastLogin: user.metadata.lastSignInTime,
      rol: role
    };
    
    try {
      // Intentar obtener usuario existente
      await userModel.getById(user.uid);
      console.log('✅ Usuario ya existe en Firestore, actualizando último login...');
      
      // Actualizar solo último login
      await userModel.update(user.uid, { 
        lastLogin: user.metadata.lastSignInTime
      });
    } catch (error) {
      // Si no existe, crearlo - ERROR CORREGIDO AQUÍ
      if (error.message.includes('no encontrado')) {
        console.log('🆕 Creando nuevo usuario en Firestore con rol:', role);
        await userModel.create(userData);
      } else {
        // Solo log del error, no lanzar excepción
        console.log('ℹ️ Error al verificar usuario (no crítico):', error.message);
      }
    }
  } catch (error) {
    console.log('⚠️ Error no crítico en ensureUserInFirestore:', error.message);
    // No lanzar error para no interrumpir el flujo
  }
}

export const authService = {
  // Registrar usuario con email y contraseña
  async register(email, password, nombre = '') {
    try {
      console.log('🔐 Registrando usuario:', email);
      
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }
      
      // Validar contraseña
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Usuario creado en Firebase Auth:', user.uid);
      
      // Actualizar perfil si se proporciona nombre
      if (nombre) {
        await updateProfile(user, { displayName: nombre });
        console.log('📝 Perfil actualizado con nombre:', nombre);
      }
      
      // Determinar si es el primer usuario (debe ser admin)
      let userRole = 'user';
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        
        if (querySnapshot.empty) {
          userRole = 'admin';
          console.log('👑 Primer usuario registrado como ADMIN');
        } else {
          console.log(`📊 Ya existen ${querySnapshot.size} usuarios en Firestore`);
        }
      } catch (error) {
        console.log("ℹ️ Error verificando usuarios:", error.message);
      }
      
      // Asegurar usuario en Firestore con el rol correcto
      await ensureUserInFirestore(user, userRole);
      
      // Generar token JWT
      const token = await generateToken(user);
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || nombre || email.split('@')[0],
          emailVerified: user.emailVerified,
          role: userRole,
          createdAt: user.metadata.creationTime
        },
        token
      };
      
    } catch (error) {
      console.error('💥 Error en authService.register:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('El email ya está registrado');
      }
      
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      }
      
      if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña es muy débil');
      }
      
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  },
  
  // Login con email y contraseña
  async login(email, password) {
    try {
      console.log('🔐 Intentando login:', email);
      
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      // Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Login exitoso para:', user.uid);
      
      // Asegurar usuario en Firestore (obtener rol existente si hay)
      let userRole = 'user';
      try {
        const userData = await userModel.getById(user.uid);
        userRole = userData.rol || 'user';
        console.log('📋 Rol obtenido de Firestore:', userRole);
      } catch (error) {
        console.log('ℹ️ Usuario no encontrado en Firestore, usando rol por defecto');
      }
      
      await ensureUserInFirestore(user, userRole);
      
      // Generar token JWT
      const token = await generateToken(user);
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          emailVerified: user.emailVerified,
          role: userRole,
          lastLogin: user.metadata.lastSignInTime,
          createdAt: user.metadata.creationTime
        },
        token
      };
      
    } catch (error) {
      console.error('💥 Error en authService.login:', error);
      
      if (error.code === 'auth/user-not-found' || 
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential') {
        throw new Error('Credenciales inválidas');
      }
      
      if (error.code === 'auth/user-disabled') {
        throw new Error('Usuario deshabilitado');
      }
      
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Demasiados intentos. Intenta más tarde');
      }
      
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  },
  
  // Cerrar sesión
  async logout() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      console.error('Error en authService.logout:', error);
      throw new Error(`Error al cerrar sesión: ${error.message}`);
    }
  },
  
  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        return null;
      }
      
      // Obtener rol desde Firestore
      let userRole = 'user';
      try {
        const userData = await userModel.getById(user.uid);
        userRole = userData.rol || 'user';
      } catch (error) {
        console.log("ℹ️ No se pudo obtener rol del usuario:", error.message);
      }
      
      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        emailVerified: user.emailVerified,
        role: userRole,
        lastLogin: user.metadata.lastSignInTime,
        createdAt: user.metadata.creationTime
      };
    } catch (error) {
      console.error('Error en authService.getCurrentUser:', error);
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  },
  
  // Verificar token JWT
  async verifyToken(token) {
    try {
      const { verifyToken } = await import('../jwt/jwt.js');
      const decoded = verifyToken(token);
      
      return {
        success: true,
        valid: true,
        user: decoded
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        error: error.message
      };
    }
  },
  
  // Recuperar contraseña
  async resetPassword(email) {
    try {
      if (!email) {
        throw new Error('Email es requerido');
      }
      
      await sendPasswordResetEmail(auth, email);
      
      return {
        success: true,
        message: 'Email de recuperación enviado'
      };
    } catch (error) {
      console.error('Error en authService.resetPassword:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No existe usuario con ese email');
      }
      
      throw new Error(`Error al recuperar contraseña: ${error.message}`);
    }
  },
  
  // Obtener usuario por email
  async getUserByEmail(email) {
    try {
      return await userModel.getByEmail(email);
    } catch (error) {
      console.error("Error en getUserByEmail:", error);
      return null;
    }
  },
  
  // Asignar rol admin (para desarrollo)
  async assignAdminRole(uid) {
    try {
      await userModel.update(uid, { rol: 'admin' });
      return {
        success: true,
        message: 'Rol admin asignado correctamente'
      };
    } catch (error) {
      console.error('Error en assignAdminRole:', error);
      throw new Error(`Error al asignar rol admin: ${error.message}`);
    }
  }
};