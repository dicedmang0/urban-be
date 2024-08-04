// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const gamePackages = require('../controllers/gamePackageController');
const verifyToken = require('../middlewares/authJwt').verifyToken;

// TODO: Swagger For This Game Package Routes

router.get('/game-package', verifyToken, gamePackages.getGamePackages);
router.post('/game-package', verifyToken, gamePackages.addGamePackages);
router.put('/game-package', verifyToken, gamePackages.updateGamePackages);

module.exports = router;
