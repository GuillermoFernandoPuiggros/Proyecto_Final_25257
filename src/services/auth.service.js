// Servicio para autenticación
// Esta capa maneja la lógica de autenticación y generación de tokens JWT

import jwt from "jsonwebtoken";

/**
 * Autenticar usuario y generar token JWT
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Objeto con token y datos del usuario
 */
export const loginService = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    // TODO: Implementar autenticación con Firebase Auth
    // Ejemplo de estructura esperada:
    // import { signInWithEmailAndPassword } from "firebase/auth";
    // const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // const user = userCredential.user;
    
    // Por ahora, validación temporal (debe ser reemplazada con Firebase)
    // TODO: Validar credenciales contra Firebase Auth
    
    // Generar token JWT
    const JWT_SECRET = process.env.JWT_SECRET || "secret_key_temporal";
    const token = jwt.sign(
      { 
        email: email,
        // Agregar más datos del usuario cuando se implemente Firebase
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // TODO: Retornar datos reales del usuario desde Firebase
    return {
      token,
      user: {
        email: email,
        // Agregar más campos cuando se implemente Firebase
      }
    };
  } catch (error) {
    // Si es un error de Firebase Auth, lanzar error de autenticación
    if (error.code === "auth/invalid-credential" || 
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password") {
      throw new Error("Credenciales inválidas");
    }
    throw new Error(`Error en la autenticación: ${error.message}`);
  }
};

/**
 * Verificar y decodificar token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Promise<Object>} Datos decodificados del token
 */
export const verifyTokenService = async (token) => {
  try {
    if (!token) {
      throw new Error("Token es requerido");
    }

    const JWT_SECRET = process.env.JWT_SECRET || "secret_key_temporal";
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return decoded;
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new Error("Token inválido");
    }
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    }
    throw new Error(`Error al verificar token: ${error.message}`);
  }
};

