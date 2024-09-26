const express = require('express');
const router = express.Router();

const trxController = require('../../controllers/transactions/transactionController');
const { verifyToken } = require('../../middlewares/authJwt');

router.post('/top-up', verifyToken, trxController.topUp)

module.exports = router;