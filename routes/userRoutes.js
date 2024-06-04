// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authJwt').verifyToken;
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validators');

router.get('/users', verifyToken, userController.getUsers);
router.post('/users', userController.addUser);

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
