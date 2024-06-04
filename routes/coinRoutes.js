// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/coins', coinController.getCoins);
router.get('/coins/:_id', coinController.getCoinsById);
/**
 * @swagger
 * /users:
 *   post:
 *     description: Create a new user
 *     parameters:
 *       - name: name
 *         description: User's name
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/coins', coinController.addCoin);
router.put('/coins', coinController.updateCoin);

module.exports = router;
