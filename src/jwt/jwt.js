import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userModel } from '../models/user.model.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_minimo_32_caracteres_cambia_esto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const jwtConfig = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN
};

// Generar token JWT con rol desde Firestore
export const generateToken = async (user) => {
  try {
    // Obtener rol del usuario desde Firestore
    let userRole = 'user';
    try {
      const userData = await userModel.getById(user.uid);
      userRole = userData.rol || 'user';
      console.log('🎫 Token generado con rol:', userRole);
    } catch (error) {
      console.log("ℹ️ Usuario no encontrado en Firestore, usando rol por defecto");
    }
    
    const payload = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      emailVerified: user.emailVerified || false,
      role: userRole,
      createdAt: user.metadata?.creationTime || new Date().toISOString()
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error("Error generando token:", error);
    throw error;
  }
};

// Verificar token JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw new Error('Error al verificar token');
  }
};

// Middleware de autenticación JWT (CON DEBUG)
export const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔐 authenticateToken - Iniciando verificación');
    
    const authHeader = req.headers['authorization'];
    console.log('🔐 Auth Header recibido:', authHeader);
    
    if (!authHeader) {
      console.log('❌ No hay header Authorization');
      return res.status(401).json({
        success: false,
        error: 'No autorizado',
        message: 'Token de autorización requerido'
      });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔐 Token extraído:', token ? `${token.substring(0, 20)}...` : 'NO');
    
    if (!token) {
      console.log('❌ Formato de token inválido');
      return res.status(401).json({
        success: false,
        error: 'No autorizado',
        message: 'Formato de token inválido. Use: Bearer TOKEN'
      });
    }
    
    console.log('🔐 Verificando token JWT...');
    const decoded = verifyToken(token);
    console.log('✅ Token decodificado:', decoded);
    
    // Verificar que el usuario aún existe en Firestore
    try {
      await userModel.getById(decoded.uid);
      console.log('✅ Usuario verificado en Firestore');
    } catch (error) {
      console.log('⚠️ Usuario no encontrado en Firestore:', error.message);
      // No bloqueamos, solo informamos
    }
    
    req.user = decoded;
    console.log('✅ authenticateToken - ÉXITO, req.user asignado');
    next();
  } catch (error) {
    console.error('❌ authenticateToken - ERROR:', error.message);
    return res.status(403).json({
      success: false,
      error: 'Token inválido',
      message: error.message
    });
  }
};

// Middleware para roles (CON DEBUG)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log('👑 authorizeRoles - Verificando roles:', roles);
    console.log('👑 Usuario actual:', req.user);
    
    if (!req.user) {
      console.log('❌ authorizeRoles - No hay req.user');
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }
    
    if (roles.length === 0) {
      console.log('✅ authorizeRoles - No hay roles requeridos, permitiendo acceso');
      return next();
    }
    
    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const requiredRoles = roles.map(role => role.toLowerCase());
    
    console.log('👑 Comparando roles - Usuario:', userRole, 'Requeridos:', requiredRoles);
    
    if (!userRole || !requiredRoles.includes(userRole)) {
      console.log('❌ authorizeRoles - Acceso denegado. Rol del usuario:', userRole);
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado',
        message: `Requiere uno de estos roles: ${roles.join(', ')}. Tu rol: ${req.user.role || 'sin rol'}`
      });
    }
    
    console.log('✅ authorizeRoles - Acceso permitido');
    next();
  };
};