const express = require("express");
const { getChallenges, getChallengeById, createChallenge, updateChallenge } = require("../controllers/challengeController");
const { createApplication, getApplications } = require("../controllers/applicationController");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", getChallenges);
router.get("/:id/applications", protect, requireRole("government", "evaluator", "admin"), getApplications);
router.get("/:id", getChallengeById);
router.post("/", protect, requireRole("government", "admin"), createChallenge);
router.patch("/:id", protect, requireRole("government", "admin"), updateChallenge);
router.post("/:id/applications", protect, requireRole("startup"), createApplication);

module.exports = router;
