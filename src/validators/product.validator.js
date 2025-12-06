export const validateProduct = (req, res, next) => {
  try {
    console.log("🔍 [VALIDATOR] Validando producto...");
    console.log("📋 [VALIDATOR] Método:", req.method);
    console.log("📋 [VALIDATOR] Ruta:", req.originalUrl);
    
    // Verificar que req.body existe
    if (!req.body) {
      console.log("❌ [VALIDATOR] req.body es undefined");
      return res.status(400).json({
        success: false,
        error: "Validación",
        message: ["El cuerpo de la solicitud está vacío o es inválido"],
        tip: "Asegúrate de enviar Content-Type: application/json"
      });
    }
    
    const { categoria, descripcion, nombre, precio, stock } = req.body;
    const errors = [];
    
    console.log("📋 [VALIDATOR] Campos recibidos:", {
      nombre: nombre !== undefined,
      descripcion: descripcion !== undefined,
      categoria: categoria !== undefined,
      precio: precio !== undefined,
      stock: stock !== undefined
    });
    
    // Validación para POST (creación) - todos los campos requeridos
    if (req.method === 'POST') {
      console.log("📋 [VALIDATOR] Validando para POST (creación)");
      
      if (!nombre || nombre.trim() === '') {
        errors.push("nombre es requerido");
      }
      
      if (!descripcion || descripcion.trim() === '') {
        errors.push("descripcion es requerida");
      }
      
      if (!categoria || categoria.trim() === '') {
        errors.push("categoria es requerida");
      }
      
      if (precio == null || isNaN(Number(precio))) {
        errors.push("precio debe ser un número válido");
      } else if (Number(precio) <= 0) {
        errors.push("precio debe ser mayor a 0");
      }
      
      if (stock == null || isNaN(Number(stock))) {
        errors.push("stock debe ser un número válido");
      } else if (Number(stock) < 0) {
        errors.push("stock no puede ser negativo");
      }
      
    } 
    // Validación para PUT 
    else if (req.method === 'PUT') {
      console.log("📋 [VALIDATOR] Validando para PUT (actualización)");
      
      // Solo validar campos si se envían
      if (nombre !== undefined) {
        if (!nombre || nombre.trim() === '') {
          errors.push("nombre no puede estar vacío si se envía");
        }
      }
      
      if (descripcion !== undefined) {
        if (!descripcion || descripcion.trim() === '') {
          errors.push("descripcion no puede estar vacía si se envía");
        }
      }
      
      if (categoria !== undefined) {
        if (!categoria || categoria.trim() === '') {
          errors.push("categoria no puede estar vacía si se envía");
        }
      }
      
      if (precio !== undefined) {
        if (isNaN(Number(precio)) || precio === null) {
          errors.push("precio debe ser un número válido");
        } else if (Number(precio) <= 0) {
          errors.push("precio debe ser mayor a 0");
        }
      }
      
      if (stock !== undefined) {
        if (isNaN(Number(stock)) || stock === null) {
          errors.push("stock debe ser un número válido");
        } else if (Number(stock) < 0) {
          errors.push("stock no puede ser negativo");
        }
      }
      
      // Verificar que al menos un campo venga para actualizar
      const camposEnviados = ['nombre', 'descripcion', 'categoria', 'precio', 'stock']
        .filter(campo => req.body[campo] !== undefined);
      
      if (camposEnviados.length === 0) {
        errors.push("Se requiere al menos un campo para actualizar");
      }
    }
    
    // Si hay errores, retornarlos
    if (errors.length > 0) {
      console.log("❌ [VALIDATOR] Errores de validación:", errors);
      return res.status(400).json({
        success: false,
        error: "Validación fallida",
        message: errors,
        receivedData: req.body
      });
    }
    
    console.log("✅ [VALIDATOR] Validación exitosa");
    next();
    
  } catch (error) {
    console.error("💥 [VALIDATOR] Error en el validador:", error);
    res.status(500).json({
      success: false,
      error: "Error interno en validación",
      message: error.message
    });
  }
};