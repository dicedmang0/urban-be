// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authJwt').verifyToken;
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validateAddUsers, validateUpdateUsers, validateUsers, validateGetUsers } = require('../middlewares/validatorUsers');

router.get('/all-users', verifyToken, userController.getUsersAll);
router.get('/users', verifyToken, validateGetUsers, userController.getUsers);
router.post('/users', verifyToken, validateAddUsers, userController.addUser);
router.put('/users', verifyToken, validateUpdateUsers, userController.updateUser);
router.delete('/users/:idUser', verifyToken, validateUsers, userController.deleteUser);

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);

module.exports = router;
