const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/authJwt').verifyToken;
const userController = require('../../controllers/user.controller');

router.post('/get-user', verifyToken, userController.getUser)
router.post('/get-users', verifyToken, userController.getUsers)
router.post('/user-transactions', verifyToken, userController.getTransactionHistoryUser)


module.exports = router;