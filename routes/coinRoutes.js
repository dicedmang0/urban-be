// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

router.get('/coins', coinController.getCoins);
router.get('/coins/:_id', coinController.getCoinsById);
router.post('/coins', coinController.addCoin);
router.put('/coins', coinController.updateCoin);

module.exports = router;
