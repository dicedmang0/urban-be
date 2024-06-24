// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const recoveryQuestions = require('../controllers/recoveryQuestionsController');
const verifyToken = require('../middlewares/authJwt').verifyToken;

// TODO: Swagger For This Recovery Questions

router.get('/questions', recoveryQuestions.getRecoveryQuestions);
router.post('/questions', verifyToken, recoveryQuestions.addRecoveryQuestions);
router.put('/questions', verifyToken, recoveryQuestions.updateRecoveryQuestions);

module.exports = router;
