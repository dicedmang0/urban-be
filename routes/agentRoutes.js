// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");
const {
  validateGetAgent,
  validateCreateAgent,
  validateIdAgent,
  validateUpdateAgent,
  validateAddAgentDetail,
  validateUpdateAgentDetail,
} = require("../middlewares/validatorAgent");
const verifyToken = require("../middlewares/authJwt").verifyToken;

router.get("/agents", validateGetAgent, agentController.getAgents);
router.post("/agents", validateCreateAgent, agentController.createAgent);
router.put(
  "/agents/:id",
  validateIdAgent,
  validateUpdateAgent,
  agentController.updateAgent
);
router.delete("/agents/:id", validateIdAgent, agentController.deleteAgent);

// Routes for Payment Method Detail
router.post('/agent-detail', validateAddAgentDetail, agentController.addAgentDetails);
router.put('/agent-detail/:id', validateUpdateAgentDetail, agentController.updateAgentDetails);

module.exports = router;
