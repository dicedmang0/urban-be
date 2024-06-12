// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const { validateAddPaymentMethod, validateUpdatePaymentMethod, validateAddPaymentMethodDetail, validateUpdatePaymentMethodDetail } = require('../middlewares/validatorPaymentMethods');
const verifyToken = require('../middlewares/authJwt').verifyToken;

router.get('/payment-methods', paymentMethodController.getPaymentMethods);

// Routes for Payment Method
router.post('/payment-method', validateAddPaymentMethod, paymentMethodController.addPaymentMethod);
router.put('/payment-method/:id', validateUpdatePaymentMethod, paymentMethodController.updatePaymentMethod);

// Routes for Payment Method Detail
router.post('/payment-method-detail', validateAddPaymentMethodDetail, paymentMethodController.addPaymentMethodDetail);
router.put('/payment-method-detail/:id', validateUpdatePaymentMethodDetail, paymentMethodController.updatePaymentMethodDetail);


module.exports = router;
