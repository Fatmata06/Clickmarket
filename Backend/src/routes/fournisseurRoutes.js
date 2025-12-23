const express = require("express");
const router = express.Router();
const fournisseurController = require("../controllers/fournisseurController");

router.post("/register", fournisseurController.registerFournisseur);
router.post("/login", fournisseurController.loginFournisseur);

router.get("/", fournisseurController.getAllFournisseurs);
router.get("/:id", fournisseurController.getFournisseur);
router.put("/:id", fournisseurController.updateFournisseur);
router.delete("/:id", fournisseurController.deleteFournisseur);

module.exports = router;

