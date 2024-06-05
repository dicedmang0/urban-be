// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validateAddPayment, validateGetPayment, validateUpdatePayment } = require('../middlewares/validatorPayments');
const verifyToken = require('../middlewares/authJwt').verifyToken;



router.get('/payments',  validateGetPayment , paymentController.getPayment);
router.post('/payments',  validateAddPayment, paymentController.addPayment);
router.put('/payments',  validateUpdatePayment, paymentController.updatePayment);

module.exports = router;
