const express = require('express');
const spnController = require('../../controllers/transactions/spnPaymentController');
const { verifyToken } = require('../../middlewares/authJwt');
const router = express.Router();

router.post('/payments-spnpay', verifyToken, spnController.paymentTrx)
router.post('/check-trx', spnController.checkTransaction)
router.post('/callback-spnpay', spnController.callBackSpnPay)


module.exports = router;