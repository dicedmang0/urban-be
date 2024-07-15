// controllers/userController.js
const GamePackage = require('../models/gamePackageModel');

exports.getGamePackages = async (req, res) => {
  try {
    const { name, title, image, description, check_username, use_uniplay, use_retail, use_credit_card, use_ewallet, use_virtual_account, use_qris, is_active } = req.query;

    const queryOptions = {
      where: {
        is_active: true
      }
    };

    if (name) queryOptions.where.name = name;
    if (title) queryOptions.where.title = title;
    if (image) queryOptions.where.image = image;
    if (description) queryOptions.where.description = description;
    // if (check_username) queryOptions.where.check_username = check_username === 'true';
    // if (use_uniplay) queryOptions.where.use_uniplay = use_uniplay === 'true';
    // if (use_retail) queryOptions.where.use_retail = use_retail === 'true';
    // if (use_credit_card) queryOptions.where.use_credit_card = use_credit_card === 'true';
    // if (use_ewallet) queryOptions.where.use_ewallet = use_ewallet === 'true';
    // if (use_virtual_account) queryOptions.where.use_virtual_account = use_virtual_account === 'true';
    // if (use_qris) queryOptions.where.use_qris = use_qris === 'true';

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
