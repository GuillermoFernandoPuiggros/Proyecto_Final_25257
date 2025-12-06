import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/product.controller.js";
import { validateProduct } from "../validators/product.validator.js";
import { authenticateToken, authorizeRoles } from "../jwt/jwt.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Middleware de autenticación para las siguientes rutas
router.use(authenticateToken);

// Rutas protegidas - CRUD solo para admin
router.post("/create", authorizeRoles('admin'), validateProduct, createProduct);
router.put("/:id", authorizeRoles('admin'), validateProduct, updateProduct);
router.delete("/:id", authorizeRoles('admin'), deleteProduct);

export default router;