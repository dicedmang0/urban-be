// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validateAddPayment, validateGetPayment, validateUpdatePayment } = require('../middlewares/validatorPayments');
const { cronosVirtualAccount, cronosAllTransactions } = require('../services/cronosGateway');
const verifyToken = require('../middlewares/authJwt').verifyToken;

router.get('/payments', validateGetPayment , paymentController.getPayment);
router.get('/all-payments', paymentController.getAllPayment);
router.post('/payments',  validateAddPayment, paymentController.addPayment);
router.put('/payments', validateUpdatePayment, paymentController.updatePayment);

router.get('/test', cronosVirtualAccount)
router.get('/test2', cronosAllTransactions)

module.exports = router;
