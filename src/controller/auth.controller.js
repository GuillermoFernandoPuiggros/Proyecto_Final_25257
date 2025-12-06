import { authService } from "../services/auth.service.js";

export const authController = {
  // Registrar usuario
  async register(req, res) {
    try {
      const { email, password, nombre } = req.body;
      
      const result = await authService.register(email, password, nombre);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
      
    } catch (error) {
      console.error('Error en authController.register:', error);
      
      // Errores específicos
      if (error.message.includes('ya está registrado')) {
        return res.status(409).json({
          success: false,
          error: 'Conflicto',
          message: error.message
        });
      }
      
      if (error.message.includes('Email inválido') || 
          error.message.includes('contraseña') ||
          error.message.includes('débil')) {
        return res.status(400).json({
          success: false,
          error: 'Validación fallida',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno',
        message: 'Error al registrar usuario'
      });
    }
  },
  
  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
      
    } catch (error) {
      console.error('Error en authController.login:', error);
      
      // Credenciales inválidas
      if (error.message.includes('Credenciales inválidas') ||
          error.message.includes('Usuario deshabilitado')) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno',
        message: 'Error al iniciar sesión'
      });
    }
  },
  
  // Logout
  async logout(req, res) {
    try {
      const result = await authService.logout();
      
      res.status(200).json({
        success: true,
        message: 'Logout exitoso',
        data: result
      });
      
    } catch (error) {
      console.error('Error en authController.logout:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno',
        message: 'Error al cerrar sesión'
      });
    }
  },
  
  // Obtener perfil actual (requiere token)
  async getProfile(req, res) {
    try {
      // req.user viene del middleware authenticateToken
      const user = req.user;
      
      res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: {
          user: user,
          authenticated: true
        }
      });
      
    } catch (error) {
      console.error('Error en authController.getProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno',
        message: 'Error al obtener perfil'
      });
    }
  },
  
  // Verificar token
  async verifyToken(req, res) {
    try {
      // Si llegamos aquí, el middleware ya validó el token
      res.status(200).json({
        success: true,
        message: 'Token válido',
        data: {
          user: req.user,
          valid: true
        }
      });
      
    } catch (error) {
      console.error('Error en authController.verifyToken:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno',
        message: 'Error al verificar token'
      });
    }
  },
  
  // Recuperar contraseña
  async resetPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Validación fallida',
          message: 'Email es requerido'
        });
      }
      
      const result = await authService.resetPassword(email);
      
      res.status(200).json({
        success: true,
        message: 'Email de recuperación enviado',
        data: result
      });
      
    } catch (error) {
      console.error('Error en authController.resetPassword:', error);
      
      if (error.message.includes('No existe usuario')) {
        return res.status(404).json({
          success: false,
          error: 'No encontrado',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno',
        message: 'Error al recuperar contraseña'
      });
    }
  },
  
  // Health check de autenticación
  async health(req, res) {
    try {
      const currentUser = await authService.getCurrentUser();
      
      res.status(200).json({
        success: true,
        message: 'Servicio de autenticación funcionando',
        data: {
          service: 'Firebase Authentication',
          status: 'online',
          authenticated: currentUser !== null,
          user: currentUser
        }
      });
      
    } catch (error) {
      console.error('Error en authController.health:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno',
        message: 'Error en servicio de autenticación'
      });
    }
  }
};