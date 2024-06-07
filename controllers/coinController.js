// controllers/userController.js
const Coin = require("../models/coinModel");

exports.getCoins = async (req, res) => {
  try {
    const coins = await Coin.findAll();
    res.status(200).json(coins);
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};

exports.getCoinsById = async (req, res) => {
  try {
    const { _id } = req.params;
    const coins = await Coin.findOne({ where: { id: _id } });
    res.status(200).json(coins);
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};

exports.addCoin = async (req, res) => {
  try {
    const { amount } = req.body;
    const coin = await Coin.create({ amount });
    res.status(200).json({ status: 'Success', message: "Success Adding Coins!" });
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};

exports.updateCoin = async (req, res) => {
  try {
    const { amount, _id } = req.body;
    const coin = await Coin.update({ amount: amount }, { where: { id: _id } });
    res.status(200).json({ status: 'Success', message: "Success Updating Coins!" });
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};
