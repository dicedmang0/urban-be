// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middlewares/authJwt').verifyToken;

router.get('/payments', verifyToken, paymentController.getPayment);
router.post('/payments', verifyToken, paymentController.addPayment);

module.exports = router;
