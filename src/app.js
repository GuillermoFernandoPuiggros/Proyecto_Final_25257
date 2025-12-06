import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import "./data/data.js";
import productsRouter from "./routes/product.routes.js";
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/user.routes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configurar CORS 
app.use(cors());

// Configurar body-parser 
app.use(bodyParser.json({
  limit: '10mb'
}));

app.use(bodyParser.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Servir archivos estáticos
app.use(express.static("public"));

// Middleware de logging SIMPLIFICADO
app.use((req, res, next) => {
  console.log(`📅 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Log body solo si existe
  if (req.body && Object.keys(req.body).length > 0 && req.method !== 'GET') {
    console.log(`📦 Body:`, req.body);
  }
  
  next();
});

// Rutas
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "¡Bienvenido a la API!",
    version: "1.0.0",
    endpoints: {
      products: {
        getAll: "GET /api/products",
        getById: "GET /api/products/:id",
        create: "POST /api/products/create",
        update: "PUT /api/products/:id",
        delete: "DELETE /api/products/:id"
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas de la API
app.use("/api/products", productsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Middleware para manejar rutas desconocidas (404)
app.use((req, res) => {
  console.log(`❌ Ruta no encontrada: ${req.method} ${req.url}`);
  
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
    message: `La ruta ${req.method} ${req.url} no existe en este servidor`
  });
});

// Middleware de error global
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.message);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Payload Too Large',
      message: 'El cuerpo de la solicitud es demasiado grande'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Error interno del servidor'
  });
});

export default app;