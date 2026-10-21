const express = require("express");
const { getUsers, createUser } = require("../controllers/userController");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, requireRole("admin"), getUsers);
router.post("/", protect, requireRole("admin"), createUser);

module.exports = router;
