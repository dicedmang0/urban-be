// controllers/userController.js
const GamePackage = require('../models/gamePackageModel');

exports.getGamePackages = async (req, res) => {
  try {
    const queryOptions = {
      where: {
        is_active: true
      }
    };
    const gamepackages = await GamePackage.findAll(queryOptions);
    res.status(200).json(gamepackages);
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.addGamePackages = async (req, res) => {
  try {
    const { name, title, image, description, check_username, use_uniplay, use_retail, use_credit_card, use_ewallet, use_virtual_account, use_qris, is_active } = req.body;

    await GamePackage.create({
        name, title, image, description, check_username, use_uniplay, use_retail, use_credit_card, use_ewallet, use_virtual_account, use_qris, is_active
    });

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Add Game Packages' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.updateGamePackages = async (req, res) => {
  try {
    const { id, name, image, title, description, check_username, use_uniplay, use_retail, use_credit_card, use_ewallet, use_virtual_account, use_qris, is_active } = req.body;


    const gamePackage = await GamePackage.findOne({ where: { id: id } });

    if (!gamePackage) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Game Packages Not Found!' });
    }

    let dto = {
        name, title, image, description, check_username, use_uniplay, use_retail, use_credit_card, use_ewallet, use_virtual_account, use_qris, is_active
    };

    await GamePackage.update(dto, {
      where: { id: id }
    });

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Update Game Packages!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};
