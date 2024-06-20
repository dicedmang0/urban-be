const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { verifyToken } = require('../middlewares/authJwt');
const {
  validateGameId,
  validateUserExist,
  validateSaveData,
  validateCoin,
  validateUserAlreadyAdded,
  validateHasEnoughCoin
} = require('../middlewares/validatorGame');
const { validateUsers } = require('../middlewares/validatorUsers');

// Add new user to the game
router.post(
  '/games/:gameId/users',
  verifyToken,
  validateGameId,
  validateUserExist,
  validateUserAlreadyAdded,
  gameController.addNewUser
);

// Get user data from a game
router.get(
  '/games/:gameId/users/:idUser',
  verifyToken,
  validateGameId,
  validateUsers,
  gameController.getUserSaveData
);

// Update user save data
router.put(
  '/games/:gameId/users/:idUser',
  verifyToken,
  validateGameId,
  validateUsers,
  validateSaveData,
  gameController.updateSaveData
);

// Add coin to user
router.post(
  '/games/:gameId/users/:idUser/add_coin',
  verifyToken,
  validateGameId,
  validateUsers,
  validateCoin,
  gameController.addCoin
);

// Deduct coin from user
router.post(
  '/games/:gameId/users/:idUser/deduct_coin',
  verifyToken,
  validateGameId,
  validateUsers,
  validateCoin,
  validateHasEnoughCoin,
  gameController.deductCoin
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - user_id
 *         - save_data
 *         - coin
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user.
 *         save_data:
 *           type: string
 *           description: The save data of the user in JSON string format.
 *         coin:
 *           type: integer
 *           description: The amount of coins the user has.
 */

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: API for managing Game data
 */

/**
 * @swagger
 * /games/{gameId}/users:
 *   post:
 *     summary: Add new user to the game
 *     tags: [Game]
 *     description: Add a new user to existing game
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - user_id
 *              properties:
 *                user_id:
 *                  type: string
 *     responses:
 *       '200':
 *         description: Success Add New User
 *       '400':
 *         description: Bad Request
 */

/**
 * @swagger
 * /games/{gameId}/users/{idUser}:
 *   get:
 *     summary: Get user data from a game
 *     tags: [Game]
 *     description: Get user data from a game
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user
 *     responses:
 *       '200':
 *         description: Successfully get user game data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       '400':
 *         description: Bad Request
 */

/**
 * @swagger
 * /games/{gameId}/users/{idUser}:
 *   put:
 *     summary: Update user save data from a game
 *     tags: [Game]
 *     description: Update user save data from a game
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - save_data
 *              properties:
 *                save_data:
 *                  type: string
 *     responses:
 *       '200':
 *         description: Successfully upadte user game data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       '400':
 *         description: Bad Request
 */

/**
 * @swagger
 * /games/{gameId}/users/{idUser}/add_coin:
 *   post:
 *     summary: Add coin to user from a game
 *     tags: [Game]
 *     description:  Add coin to user from a game
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - coin
 *              properties:
 *                save_data:
 *                  type: integer
 *     responses:
 *       '200':
 *         description: Successfully add coin to user game data
 *       '400':
 *         description: Bad Request
 */

/**
 * @swagger
 * /games/{gameId}/users/{idUser}/deduct_coin:
 *   post:
 *     summary: Deduct coin from user from a game
 *     tags: [Game]
 *     description:  Deduct coin from user from a game
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - coin
 *              properties:
 *                save_data:
 *                  type: integer
 *     responses:
 *       '200':
 *         description: Successfully deduct coin to user game data
 *       '400':
 *         description: Bad Request
 */
