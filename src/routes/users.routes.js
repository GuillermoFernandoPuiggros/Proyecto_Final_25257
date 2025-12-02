import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/product.controller.js";
import { validateProduct } from "../validators/product.validator.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/create", validateProduct, createProduct);
router.put("/:id", validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

export default router;