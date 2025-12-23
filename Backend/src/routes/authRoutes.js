const router = require("express").Router();
const { register, login } = require("../controllers/authcontroller");
const { auth, isRole } = require("../middleware/auth");

// Auth
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/client-only", auth, isRole("CLIENT"), (req, res) => {
  res.json({ message: "Bienvenue client" });
});

router.get("/admin-only", auth, isRole("ADMIN"), (req, res) => {
  res.json({ message: "Bienvenue admin" });
});

module.exports = router;
