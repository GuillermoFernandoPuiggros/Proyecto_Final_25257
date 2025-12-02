import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import "./data/data.js";
import productsRouter from "./routes/product.routes.js";
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configurar CORS
app.use(cors());

// Configurar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static("public"));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API!");
});

// Rutas de la API
app.use("/api/products", productsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Middleware para manejar rutas desconocidas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
    message: `La ruta ${req.method} ${req.url} no existe en este servidor`,
  });
});

// ¡¡IMPORTANTE!! Exportar la app (sin ejecutarla aquí)
export default app;