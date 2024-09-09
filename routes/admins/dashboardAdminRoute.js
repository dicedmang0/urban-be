const express = require('express');
const router = express.Router();

const dashboardController = require('../../controllers/admins/dashboardController');
const { verifyToken } = require('../../middlewares/authJwt');
const { adminVerify } = require('../../middlewares/adminMiddlewares');

router.post('/dashboard', verifyToken, adminVerify, dashboardController.dashboard)

module.exports = router;