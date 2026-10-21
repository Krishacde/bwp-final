const express = require("express");
const { register, login, me, requestPasswordReset, resetPassword, changePassword } = require("../controllers/authController");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, requireRole("government", "evaluator", "startup", "admin"), changePassword);
router.get("/me", protect, me);

module.exports = router;
