import { userModel } from "../models/user.model.js";
import { auth } from "../data/data.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const userService = {
  // Crear usuario COMPLETO (Firebase Auth + Firestore) - NUEVO MÉTODO
  async createCompleteUser(userData) {
    try {
      const { email, password, nombre, rol = 'user', ubicacion = '', experiencia = '' } = userData;
      
      console.log('🔐 Creando usuario COMPLETO:', email);
      
      // 1. Validar campos requeridos
      if (!email || !password || !nombre) {
        throw new Error('Email, password y nombre son requeridos');
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
      
      // 2. Crear usuario en Firebase Auth
      console.log('🔥 Creando en Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Usuario creado en Firebase Auth, UID:', user.uid);
      
      // 3. Actualizar perfil con nombre
      if (nombre) {
        await updateProfile(user, { displayName: nombre });
        console.log('📝 Perfil actualizado con nombre:', nombre);
      }
      
      // 4. Preparar datos para Firestore
      const firestoreUserData = {
        uid: user.uid,
        email: email,
        nombre: nombre,
        rol: rol,
        ubicacion: ubicacion,
        experiencia: experiencia,
        emailVerified: user.emailVerified || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 5. Crear usuario en Firestore
      await userModel.create(firestoreUserData);
      console.log('📁 Usuario creado en Firestore');
      
      return {
        success: true,
        message: 'Usuario creado exitosamente (Auth + Firestore)',
        data: {
          uid: user.uid,
          email: email,
          nombre: nombre,
          rol: rol,
          ubicacion: ubicacion,
          experiencia: experiencia,
          emailVerified: user.emailVerified,
          createdAt: firestoreUserData.createdAt,
          canLogin: true  // Indicador de que puede hacer login
        }
      };
      
    } catch (error) {
      console.error('💥 Error en createCompleteUser:', error);
      
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('El email ya está registrado en Firebase Auth');
      }
      
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      }
      
      if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña es muy débil (mínimo 6 caracteres)');
      }
      
      throw new Error(`Error al crear usuario completo: ${error.message}`);
    }
  },

  // Método original para solo Firestore (mantener compatibilidad)
  async create(userData) {
    try {
      // Verificar si ya existe
      try {
        const existingUser = await userModel.getByEmail(userData.email);
        if (existingUser) {
          throw new Error('El usuario ya existe en Firestore');
        }
      } catch (error) {
        // Si no existe, continuar
      }

      const createdUser = await userModel.create(userData);
      
      return {
        success: true,
        message: "Usuario creado exitosamente en Firestore",
        data: createdUser
      };
    } catch (error) {
      console.error("Error en userService.create:", error);
      throw error;
    }
  },

  // Obtener todos los usuarios
  async getAll() {
    try {
      const users = await userModel.getAll();
      
      return {
        success: true,
        data: users,
        count: users.length
      };
    } catch (error) {
      console.error("Error en userService.getAll:", error);
      throw new Error("Error al obtener usuarios");
    }
  },

  // Obtener usuario por ID
  async getById(uid) {
    try {
      const user = await userModel.getById(uid);
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error("Error en userService.getById:", error);
      throw error.message.includes("no encontrado") 
        ? error 
        : new Error("Error al obtener usuario");
    }
  },

  // Actualizar usuario
  async update(uid, updates) {
    try {
      // Campos que no se pueden actualizar
      const { uid: id, email, createdAt, ...allowedUpdates } = updates;
      
      const updatedUser = await userModel.update(uid, allowedUpdates);
      
      return {
        success: true,
        message: "Usuario actualizado exitosamente",
        data: updatedUser
      };
    } catch (error) {
      console.error("Error en userService.update:", error);
      throw error.message.includes("no encontrado")
        ? error
        : new Error("Error al actualizar usuario");
    }
  },

  // Eliminar usuario
  async delete(uid) {
    try {
      const result = await userModel.delete(uid);
      
      return {
        success: true,
        message: "Usuario eliminado exitosamente",
        data: result
      };
    } catch (error) {
      console.error("Error en userService.delete:", error);
      throw error.message.includes("no encontrado")
        ? error
        : new Error("Error al eliminar usuario");
    }
  },

  // Actualizar rol de usuario
  async updateRole(uid, newRole) {
    try {
      if (!['admin', 'user', 'moderator'].includes(newRole)) {
        throw new Error("Rol inválido. Roles permitidos: admin, user, moderator");
      }

      const updatedUser = await userModel.update(uid, { rol: newRole });
      
      return {
        success: true,
        message: `Rol actualizado a ${newRole}`,
        data: updatedUser
      };
    } catch (error) {
      console.error("Error en userService.updateRole:", error);
      throw error;
    }
  },

  // Obtener usuario actual desde token
  async getCurrentUser(uid) {
    try {
      if (!uid) {
        throw new Error("ID de usuario requerido");
      }
      
      const user = await userModel.getById(uid);
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error("Error en userService.getCurrentUser:", error);
      throw error;
    }
  },

  // Buscar usuario por email
  async getByEmail(email) {
    try {
      return await userModel.getByEmail(email);
    } catch (error) {
      console.error("Error en userService.getByEmail:", error);
      return null;
    }
  }
};