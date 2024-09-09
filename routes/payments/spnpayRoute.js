const express = require('express');
const spnController = require('../../controllers/spnPaymentController');
const { verifyToken } = require('../../middlewares/authJwt');
const router = express.Router();

router.post('/payments-spnpay', verifyToken, spnController.paymentTrx)
router.post('/callback-spnpay', spnController.callBackSpnPay)


module.exports = router;