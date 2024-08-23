// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {
  validateAddPayment,
  validateGetPayment,
  validateUpdatePayment,
  validateCheckPayment,
  validateUpdatePaymentByUser,
  validateAddPaymentPrivate
} = require('../middlewares/validatorPayments');
const {
  getAccessToken,
  getInquirySaldo,
  getInquiryDTU,
  getInquiryVoucher,
  postConfirmPayment,
  getCheckOrder
} = require('../services/unipinGateway');
const verifyToken = require('../middlewares/authJwt').verifyToken;

router.get('/all-payments', verifyToken, paymentController.getAllPayment);
router.get(
  '/payments',
  verifyToken,
  validateGetPayment,
  paymentController.getPayment
);

router.get('/payments/today', paymentController.getTotalTransactionsToday);
router.post(
  '/payments',
  verifyToken,
  validateAddPayment,
  paymentController.addPayment
);
router.put(
  '/payments',
  verifyToken,
  validateUpdatePayment,
  paymentController.updatePayment
);

// TODO: Swagger For Checking Transactions

router.get(
  '/check-payments/:payment_id',
  verifyToken,
  validateCheckPayment,
  paymentController.checkStatusPaymentsCronos
);

router.put(
  '/update-payments-by-user',
  verifyToken,
  validateUpdatePaymentByUser,
  paymentController.updatePaymentByUser
);

router.get(
  '/retrieveDTU',
  verifyToken,
  paymentController.getDTU
)

router.get(
  '/retrieveSaldo',
  verifyToken,
  paymentController.getSaldoUni
)

router.get(
  '/checkOrderOnUniPlay/:order_id',
  verifyToken,
  paymentController.checkOrderOnUniPlay
)

router.post(
  '/private-initial-payments',
  // verifyToken,
  // validateAddPaymentPrivate,
  paymentController.privateInitialPayment
);

router.put(
  '/private-update-payments-by-user',
  // verifyToken,
  validateUpdatePaymentByUser,
  paymentController.privateUpdatePaymentByUser
);

router.post(
  '/confirmation/:payment_id',
  // verifyToken,
  // validateUpdatePaymentByUser,
  paymentController.privateConfirmationPayment
);
router.get(
  '/total-balances',
  verifyToken,
  paymentController.getTotalBalances
);

// router.get('/test', getAccessToken)
// router.get('/test2', getInquirySaldo)
// router.get('/test3', getInquiryDTU)
// router.get('/test4', getInquiryVoucher)
// router.get('/test5', postConfirmPayment)
// router.get('/test6', getCheckOrder)

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - id
 *         - transaction_id
 *         - game_id
 *         - user_id
 *         - amount
 *         - payment_method
 *         - request_date
 *         - payment_status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the payment.
 *         merchant_id:
 *           type: string
 *           description: Optional merchant ID associated with the payment.
 *         transaction_id:
 *           type: string
 *           description: The unique transaction ID for the payment. Required.
 *         game_id:
 *           type: string
 *           description: The ID of the game related to the payment. Required.
 *         nmid:
 *           type: string
 *           description: Optional NMID associated with the payment.
 *         user_id:
 *           type: string
 *           description: The ID of the user making the payment. Required.
 *         name:
 *           type: string
 *           description: Optional name associated with the payment.
 *         phone_number:
 *           type: string
 *           description: Optional phone number associated with the payment.
 *         amount:
 *           type: string
 *           description: The amount of the payment. Required.
 *         payment_method:
 *           type: string
 *           description: The method used for the payment (e.g., credit card, PayPal). Required.
 *         payment_date:
 *           type: string
 *           format: date-time
 *           description: Optional date when the payment was made.
 *         request_date:
 *           type: string
 *           format: date-time
 *           description: The date when the payment request was made. Required.
 *         server_id:
 *           type: string
 *           description: The server (e.g., JAPAN, ID, etc). Optional.
 *         package:
 *           type: string
 *           description: The package (e.g., 60 + 5 Tokens, etc). Optional.
 *         ref_id:
 *           type: string
 *           description: refferral user/agents (e.g., Hyungg, etc). Optional.
 *         code:
 *           type: string
 *           description: code is for payment method like bank (e.g., 014, 015, ovo, bca, etc). Optional.
 */

/**
 * @swagger
 * /api/payments?offset=0&limit=100:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     description: Retrieve a list of all payments.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     responses:
 *       '200':
 *         description: A list of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       '401':
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Add a new payment
 *     tags: [Payments]
 *     description: Create a new payment.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       description: Only Merchant ID, transaction id, code, nmid, name, user_id, game_id, amount, phone_number, payment_method, requested_date, server_id, package, code, ref_id
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       '201':
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       '401':
 *         description: Unauthorized
 *       '400':
 *         description: Bad request, validation error
 */

/**
 * @swagger
 * /api/payments:
 *   put:
 *     summary: Update a payment
 *     tags: [Payments]
 *     description: Update an existing payment.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       description: only id as payment_id and payment status 
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       '200':
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Payment not found
 *       '400':
 *         description: Bad request, validation error
 */

/**
 * @swagger
 * /api/update-payments-by-user:
 *   put:
 *     summary: Update a payment by users
 *     tags: [Payments]
 *     description: Update an status of transaction existing payment.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       description: only id as payment_id and payment status 
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *               - payment_id
 *              properties:
 *               payment_id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                - status
 *                - message
 *               properties:
 *                status:
 *                 type: string
 *                message:
 *                 type: string
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Payment not found
 *       '400':
 *         description: Bad request, validation error
 */

/**
 * @swagger
 * /api/private-initial-payments:
 *   post:
 *     summary: Add a initial payments
 *     tags: [Payments]
 *     description: Create a private initial payments masking.
 *     requestBody:
 *       required: true
 *       description: Only Merchant ID, transaction id, code, nmid, name, user_id, game_id, amount, phone_number, payment_method, requested_date, server_id, package, code, ref_id
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *               - amount
 *               - nmid
 *               - payment_date
 *               - requested_date
 *              properties:
 *               phone_number:
 *                 type: string
 *               amount:
 *                 type: string
 *               name:
 *                 type: string
 *               user_id:
 *                 type: string
 *               game_id:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               nmid:
 *                 type: string
 *               code:
 *                 type: string
 *               merchant_id:
 *                 type: string
 *               transaction_id:
 *                 type: string
 *               payment_date:
 *                 type: string
 *               requested_date:
 *                 type: string
 *               server_id:
 *                 type: string
 *               package:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Payment created successfully
 *       '401':
 *         description: Unauthorized
 *       '400':
 *         description: Bad request, validation error
 */


/**
 * @swagger
 * /api/private-update-payments-by-user:
 *   put:
 *     summary: Update a private payment by users
 *     tags: [Payments]
 *     description: Update an status of transaction existing payment.
 *     requestBody:
 *       required: true
 *       description: only id as payment_id and payment status 
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *               - payment_id
 *              properties:
 *               payment_id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Payment updated successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Payment not found
 *       '400':
 *         description: Bad request, validation error
 */


module.exports = router;
