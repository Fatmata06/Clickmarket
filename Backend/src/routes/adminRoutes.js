const express = require("express");
const router = express.Router();
const { auth, isRole } = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require("../controllers/adminController");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gestion des utilisateurs par les administrateurs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Toutes les routes nécessitent l'authentification et le rôle admin
router.use(auth);
router.use(isRole(["admin"]));

// Routes pour la gestion des utilisateurs
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

module.exports = router;
