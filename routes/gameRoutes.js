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
