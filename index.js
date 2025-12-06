import "dotenv/config";
import app from "./src/app.js";

// Obtener el puerto desde las variables de entorno
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
  console.log(`\n📊 Endpoints disponibles:`);
  console.log(`   GET    http://localhost:${PORT}/api/products`);
  console.log(`   POST   http://localhost:${PORT}/api/products/create`);
  console.log(`   PUT    http://localhost:${PORT}/api/products/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/products/:id`);
  console.log(`   GET    http://localhost:${PORT}/health`);
});