import "dotenv/config";
import app from "./src/app.js";

// Obtener el puerto desde las variables de entorno
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
