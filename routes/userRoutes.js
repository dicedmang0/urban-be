// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authJwt').verifyToken;
const authController = require('../controllers/authController');
const {
  validateRegister,
  validateLogin,
  validateAddUsers,
  validateUpdateUsers,
  validateUsers,
  validateGetUsers,
  validateRegisterUserRandom,
  validateForgotPassword,
  validateAnswerCheck,
  validateUserCheck
} = require('../middlewares/validatorUsers');

router.get('/all-users', verifyToken, userController.getUsersAll);
router.get('/users', verifyToken, validateGetUsers, userController.getUsers);
router.post('/users', verifyToken, validateAddUsers, userController.addUser);
router.put('/users', validateUpdateUsers, userController.updateUser);
router.delete(
  '/users/:idUser',
  verifyToken,
  validateUsers,
  userController.deleteUser
);

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);

//TODO: Swagger API Answer Check and Change Password
// TODO: Create API Update Profile

router.post('/answer-check', validateAnswerCheck, authController.checkAnswerUser)
router.post('/user-check', validateUserCheck, authController.checkUserCheck)
router.post('/reset-password', validateForgotPassword, authController.changePasswordRecovery)

router.post(
  '/user-regist-random',
  validateRegisterUserRandom,
  authController.registerRandomUser
);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - password
 *         - role
 *         - is_active
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user.
 *         ref_id:
 *           type: string
 *           description: Optional reference ID.
 *         username:
 *           type: string
 *           description: The username for the user. Unique and required.
 *         password:
 *           type: string
 *           description: The password for the user. Required.
 *         email:
 *           type: string
 *           description: The email address of the user. Optional.
 *         token:
 *           type: string
 *           description: Token associated with the user for authentication purposes. Optional.
 *         agent_id:
 *           type: string
 *           format: uuid
 *           description: The UUID of the associated agent, if any.
 *         role:
 *           type: string
 *           description: The role of the user. Required.
 *         is_active:
 *           type: boolean
 *           description: Indicates whether the user account is active or not. Required.
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Users]
 *     summary: Login to the application
 *     description: Login with username and password to access the application.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Users]
 *     summary: Register to this application
 *     description: Register with username, email and password to access the application.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful Register
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/users?offset=0&limit=100:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     description: Retrieve a list of all users. this is need limit and offset as query.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     description: Create a new user.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *     requestBody:
 *       description: Only Username, Password, Role, Email, Is Active, Agent Id
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 *       '400':
 *         description: Bad request, validation error
 */

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Update an existing user.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *     requestBody:
 *       description: Only ID, Username, Password, Role, Email, Is Active, Agent Id
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '400':
 *         description: Bad request, validation error
 */

/**
 * @swagger
 * /api/users/{idUser}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Delete a user by ID.
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token for authentication
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user to delete
 *     responses:
 *       '204':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 */

module.exports = router;
