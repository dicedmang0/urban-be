// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const rulePayment = require('../controllers/rulePaymentController');
const verifyToken = require('../middlewares/authJwt').verifyToken;

// TODO: Swagger For This Rules

router.get('/rule/:code', rulePayment.getRulePayment);
router.post('/rule', verifyToken, rulePayment.addRulePayment);
router.put('/rule', verifyToken, rulePayment.updateRulePayment);

module.exports = router;
