const express = require("express");
const { scoreApplication, shortlistApplication } = require("../controllers/applicationController");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/:id/score", protect, requireRole("evaluator"), scoreApplication);
router.post("/:id/shortlist", protect, requireRole("evaluator"), shortlistApplication);

module.exports = router;
