export const validateProduct = (req, res, next) => {
  const { categoria, descripcion, id_int, nombre, precio, stock } = req.body;
  const errors = [];
  if (!nombre) errors.push("nombre es requerido");
  if (precio == null || isNaN(Number(precio))) errors.push("precio debe ser numérico");
  if (stock == null || isNaN(Number(stock))) errors.push("stock debe ser numérico");
  if (!categoria) errors.push("categoria es requerida");
  if (errors.length) return res.status(400).json({ success:false, error: "Validación", message: errors });
  next();
};