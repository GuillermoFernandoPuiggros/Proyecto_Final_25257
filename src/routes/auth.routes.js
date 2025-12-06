import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { authenticateToken } from "../jwt/jwt.js"; // CAMBIAR ESTA LÍNEA
import { validateRegister, validateLogin } from "../validators/auth.validator.js";

const router = Router();

// RUTAS PÚBLICAS
router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/reset-password", authController.resetPassword);

// RUTAS PROTEGIDAS (requieren token JWT)
router.post("/logout", authenticateToken, authController.logout);
router.get("/profile", authenticateToken, authController.getProfile);
router.get("/verify", authenticateToken, authController.verifyToken);
router.get("/health", authenticateToken, authController.health);

export default router; 