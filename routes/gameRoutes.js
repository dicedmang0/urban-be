const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.post("/:gameId/users", gameController.addNewUser);
router.get("/:gameId/users/:userId", gameController.getUserSaveData);
router.put("/:gameId/users/:userId", gameController.updateSaveData);
router.post("/:gameId/users/:userId/add_coin", gameController.addCoin);
router.post("/:gameId/users/:userId/deduct_coin", gameController.deductCoin);

module.exports = router;
