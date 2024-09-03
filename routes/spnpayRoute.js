const express = require('express');
const spnController = require('../controllers/spnPaymentController');
const router = express.Router();

router.post('/payments', spnController.getCredential)
router.post('/callback-spnpay', spnController.callBackSpnPay)


module.exports = router;