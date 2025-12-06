export const validateRegister = (req, res, next) => {
    const { nombre, email, password } = req.body;
    const errors = [];
  
    if (!nombre || nombre.trim() === '') {
      errors.push("nombre es requerido");
    }
  
    if (!email || email.trim() === '') {
      errors.push("email es requerido");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push("email no es válido");
      }
    }
  
    if (!password || password.trim() === '') {
      errors.push("contraseña es requerida");
    } else if (password.length < 6) {
      errors.push("la contraseña debe tener al menos 6 caracteres");
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
  
  export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];
  
    if (!email || email.trim() === '') {
      errors.push("email es requerido");
    }
  
    if (!password || password.trim() === '') {
      errors.push("contraseña es requerida");
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