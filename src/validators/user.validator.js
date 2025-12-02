export const validateUser = (req, res, next) => {
  const { email, nombre, password, rol, ubicacion, experiencia } = req.body;
  const errors = [];
  if (!email) errors.push("email es requerido");
  if (!password) errors.push("password es requerido");
  if (!nombre) errors.push("nombre es requerido");
  if (errors.length) return res.status(400).json({ success:false, error: "Validación", message: errors });
  next();
};