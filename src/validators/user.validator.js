export const validateUser = (req, res, next) => {
  const { email, nombre, password, rol, ubicacion, experiencia } = req.body;
  const errors = [];
  
  // Validaciones básicas
  if (!email || email.trim() === '') {
    errors.push("email es requerido");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("email no es válido");
    }
  }
  
  if (!nombre || nombre.trim() === '') {
    errors.push("nombre es requerido");
  }
  
  // Si viene password, validarla
  if (password !== undefined) {
    if (password.trim() === '') {
      errors.push("password es requerido si se proporciona");
    } else if (password.length < 6) {
      errors.push("la contraseña debe tener al menos 6 caracteres");
    }
  }
  
  // Validar rol si viene
  if (rol && !['admin', 'user', 'moderator'].includes(rol)) {
    errors.push("rol debe ser: admin, user o moderator");
  }
  
  if (errors.length) {
    return res.status(400).json({ 
      success: false, 
      error: "Validación fallida", 
      message: errors 
    });
  }
  
  next();
};