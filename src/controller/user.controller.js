import { userService } from "../services/user.service.js";

export const getAllUsers = async (req, res) => {
  try {
    console.log('🔍 DEBUG getAllUsers - req.user:', req.user);
    
    const result = await userService.getAll();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    res.status(500).json({
      success: false,
      error: "Error interno",
      message: "Error al obtener usuarios"
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 DEBUG getUserById - req.user:', req.user);
    console.log('🔍 DEBUG getUserById - id:', id);
    
    if (req.user.role !== 'admin' && req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        error: "Acceso denegado",
        message: "Solo puedes ver tu propio perfil"
      });
    }

    const result = await userService.getById(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getUserById:", error);
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        error: "No encontrado",
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Error interno",
      message: "Error al obtener usuario"
    });
  }
};

export const createUser = async (req, res) => {
  try {
    console.log('🔍 DEBUG createUser - req.user:', req.user);
    console.log('🔍 DEBUG createUser - req.body:', req.body);
    
    const userData = req.body;
    
    // Validación básica
    if (!userData.email || !userData.nombre) {
      return res.status(400).json({
        success: false,
        error: "Validación fallida",
        message: "Email y nombre son requeridos"
      });
    }

    // DETECTAR SI VIENE PASSWORD - usar creación COMPLETA
    if (userData.password) {
      console.log('🔄 Usando creación COMPLETA (con password)');
      
      // Validar que el admin no pueda crear otro admin directamente
      if (userData.rol === 'admin' && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: "Acceso denegado",
          message: "Solo administradores pueden crear usuarios admin"
        });
      }
      
      // Asignar rol por defecto si no viene
      if (!userData.rol) {
        userData.rol = 'user';
      }
      
      const result = await userService.createCompleteUser(userData);
      res.status(201).json(result);
      
    } else {
      // Sin password - creación solo en Firestore
      console.log('📝 Usando creación solo Firestore (sin password)');
      
      if (!userData.uid) {
        return res.status(400).json({
          success: false,
          error: "Validación fallida",
          message: "UID es requerido cuando no se proporciona password"
        });
      }
      
      const result = await userService.create(userData);
      res.status(201).json(result);
    }
    
  } catch (error) {
    console.error("Error en createUser:", error);
    
    if (error.message.includes("ya está registrado") || 
        error.message.includes("ya existe")) {
      return res.status(409).json({
        success: false,
        error: "Conflicto",
        message: error.message
      });
    }
    
    if (error.message.includes("inválido") || 
        error.message.includes("contraseña") ||
        error.message.includes("débil")) {
      return res.status(400).json({
        success: false,
        error: "Validación fallida",
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Error interno",
      message: "Error al crear usuario"
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log('🔍 DEBUG updateUser - req.user:', req.user);
    console.log('🔍 DEBUG updateUser - id:', id);
    
    if (req.user.role !== 'admin' && req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        error: "Acceso denegado",
        message: "Solo puedes actualizar tu propio perfil"
      });
    }

    if (updates.rol && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Acceso denegado",
        message: "Solo administradores pueden cambiar roles"
      });
    }

    const result = await userService.update(id, updates);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en updateUser:", error);
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        error: "No encontrado",
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Error interno",
      message: "Error al actualizar usuario"
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 DEBUG deleteUser - req.user:', req.user);
    console.log('🔍 DEBUG deleteUser - id:', id);
    
    if (req.user.uid === id) {
      return res.status(400).json({
        success: false,
        error: "Operación no permitida",
        message: "No puedes eliminar tu propia cuenta"
      });
    }

    const result = await userService.delete(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteUser:", error);
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        error: "No encontrado",
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Error interno",
      message: "Error al eliminar usuario"
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    console.log('🔍 DEBUG updateUserRole - req.user:', req.user);
    console.log('🔍 DEBUG updateUserRole - id:', id);
    
    if (!role) {
      return res.status(400).json({
        success: false,
        error: "Validación fallida",
        message: "Role es requerido"
      });
    }

    const result = await userService.updateRole(id, role);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en updateUserRole:", error);
    
    if (error.message.includes("Rol inválido")) {
      return res.status(400).json({
        success: false,
        error: "Validación fallida",
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Error interno",
      message: "Error al actualizar rol"
    });
  }
};

export const getCurrentUserProfile = async (req, res) => {
  try {
    console.log('🔍 DEBUG getCurrentUserProfile - req.user:', req.user);
    
    const result = await userService.getCurrentUser(req.user.uid);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getCurrentUserProfile:", error);
    res.status(500).json({
      success: false,
      error: "Error interno",
      message: "Error al obtener perfil"
    });
  }
};