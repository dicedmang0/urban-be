const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/games/:gameId/users', gameController.addNewUser);
router.get('/games/:gameId/users/:userId', gameController.getUserSaveData);
router.put('/games/:gameId/users/:userId', gameController.updateSaveData);
router.post('/games/:gameId/users/:userId/add_coin', gameController.addCoin);
router.post(
  '/games/:gameId/users/:userId/deduct_coin',
  gameController.deductCoin
);

module.exports = router;
