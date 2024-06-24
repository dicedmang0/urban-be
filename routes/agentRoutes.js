// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const {
  validateGetAgent,
  validateCreateAgent,
  validateIdAgent,
  validateUpdateAgent,
  validateAddAgentDetail,
  validateUpdateAgentDetail
} = require('../middlewares/validatorAgent');
const verifyToken = require('../middlewares/authJwt').verifyToken;

router.get('/agents', verifyToken, validateGetAgent, agentController.getAgents);
router.post(
  '/agents',
  verifyToken,
  validateCreateAgent,
  agentController.createAgent
);
router.put(
  '/agents/:id',
  validateIdAgent,
  validateUpdateAgent,
  agentController.updateAgent
);
router.delete(
  '/agents/:id',
  verifyToken,
  validateIdAgent,
  agentController.deleteAgent
);

// TODO: Swagger For This Agent Detail

// Routes for Agent Detail
router.post(
  '/agent-detail',
  verifyToken,
  validateAddAgentDetail,
  agentController.addAgentDetails
);
router.put(
  '/agent-detail/:id',
  verifyToken,
  validateUpdateAgentDetail,
  agentController.updateAgentDetails
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - name
 *         - is_active
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         is_active:
 *           type: boolean
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174002"
 *         name: "Agent Name"
 *         is_active: true
 *     
 */

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: API for managing agents
 */

/**
 * @swagger
 * /api/agents?offset=0&limit=100:
 *   get:
 *     summary: Retrieve a list of agents
 *     tags: [Agents]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token for authentication
 *     responses:
 *       200:
 *         description: A list of agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 */

/**
 * @swagger
 * /api/agents:
 *   post:
 *     summary: Create a new agent
 *     tags: [Agents]
 *     description: Create a new agent.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the agent.
 *               is_active:
 *                 type: boolean
 *                 description: status of the agent.
 *             required:
 *               - name
 *               - is_active
 *     responses:
 *       '201':
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       '401':
 *         description: Unauthorized
 *       '400':
 *         description: Bad request, validation error
 */

/**
 * @swagger
 * /api/agents/{id}:
 *   put:
 *     summary: Update an agent
 *     tags: [Agents]
 *     description: Update an existing agent.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the agent to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agent'
 *     responses:
 *       '200':
 *         description: Agent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Agent not found
 *       '400':
 *         description: Bad request, validation error
 */

/**
 * @swagger
 * /api/agents/{id}:
 *   delete:
 *     summary: Delete an agent
 *     tags: [Agents]
 *     description: Delete an agent by ID.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the agent to delete
 *     security:
 *       - accessToken: []
 *     responses:
 *       '204':
 *         description: Agent deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Agent not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AgentDetail:
 *       type: object
 *       required:
 *         - id
 *         - code
 *         - name
 *         - is_active
 *         - agentDetailsId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the agent detail.
 *         code:
 *           type: string
 *           description: The code for the agent detail.
 *         name:
 *           type: string
 *           description: The name of the agent detail.
 *         is_active:
 *           type: boolean
 *           description: Indicates if the agent detail is active.
 *         agentDetailsId:
 *           type: string
 *           format: uuid
 *           description: The ID of the associated agent.
 *       example:
 *         id: d2a6e92f-60e4-4a7c-b1a1-1784c24b6fe5
 *         code: AGT001
 *         name: Agent Detail 1
 *         is_active: true
 *         agentDetailsId: 6a7f5868-8ba7-4b49-933f-1e3dd196a576
 */

module.exports = router;
