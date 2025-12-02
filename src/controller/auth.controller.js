// Controlador para autenticación
// Esta capa maneja las peticiones HTTP y delega la lógica de autenticación a los servicios

import { loginService } from "../services/auth.service.js";

// POST /auth/login - Autenticar usuario y devolver Bearer token
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se recibieron las credenciales
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Credenciales incompletas",
        message: "Se requiere email y password"
      });
    }

    // Llamar al servicio de autenticación
    const result = await loginService(email, password);
    
    res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    // Si es un error de credenciales inválidas, retornar 401
    if (error.message.includes("Credenciales inválidas")) {
      return res.status(401).json({
        success: false,
        error: "Error de autenticación",
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Error en el servidor",
      message: error.message
    });
  }
};

