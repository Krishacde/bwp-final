const express = require("express");
const { getStartups, createStartup, getStartupProfile, updateStartupProfile } = require("../controllers/startupController");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, requireRole("admin", "government", "evaluator"), getStartups);
router.post("/", protect, requireRole("admin"), createStartup);
router.get("/profile", protect, requireRole("startup"), getStartupProfile);
router.patch("/profile", protect, requireRole("startup"), updateStartupProfile);

module.exports = router;
