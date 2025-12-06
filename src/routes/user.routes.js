import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../jwt/jwt.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  getCurrentUserProfile
} from "../controller/user.controller.js";

const router = Router();

// Middleware de debug para todas las rutas
router.use((req, res, next) => {
  console.log(`🔵 USER ROUTE: ${req.method} ${req.path}`);
  console.log('🔵 Auth Header:', req.headers.authorization ? 'Presente' : 'Ausente');
  next();
});

// Todas las rutas requieren autenticación JWT
router.use(authenticateToken);

// Middleware post-autenticación
router.use((req, res, next) => {
  console.log('🟢 Autenticado - req.user:', req.user);
  next();
});

// Obtener perfil actual del usuario logueado
router.get("/me", getCurrentUserProfile);

// Obtener todos los usuarios (solo admin)
router.get("/", 
  (req, res, next) => {
    console.log('🟡 Llegó a GET /users - Verificando rol admin...');
    next();
  },
  authorizeRoles('admin'),
  getAllUsers
);

// Obtener usuario por ID
router.get("/:id", getUserById);

// Crear usuario (solo admin) - VALIDATOR TEMPORALMENTE COMENTADO
router.post("/", 
  (req, res, next) => {
    console.log('🟡 Llegó a POST /users - req.body:', req.body);
    next();
  },
  authorizeRoles('admin'),
  // validateUser, // COMENTADO TEMPORALMENTE
  createUser
);

// Actualizar usuario
router.put("/:id", updateUser);

// Eliminar usuario (solo admin)
router.delete("/:id", 
  (req, res, next) => {
    console.log('🟡 Llegó a DELETE /users/:id');
    next();
  },
  authorizeRoles('admin'),
  deleteUser
);

// Actualizar rol de usuario (solo admin)
router.patch("/:id/role", 
  (req, res, next) => {
    console.log('🟡 Llegó a PATCH /users/:id/role');
    next();
  },
  authorizeRoles('admin'),
  updateUserRole
);

export default router;