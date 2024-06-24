// controllers/userController.js
const RecoveryQuestions = require('../models/recoveryQuestionModel');

exports.getRecoveryQuestions = async (req, res) => {
  try {
    const queryOptions = {
      where: {
        is_active: true
      }
    };
    const users = await RecoveryQuestions.findAll(queryOptions);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.addRecoveryQuestions = async (req, res) => {
  try {
    const { text, is_active } = req.body;

    await RecoveryQuestions.create({
      text,
      is_active: is_active
    });

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Add Recovery Questions' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.updateRecoveryQuestions = async (req, res) => {
  try {
    const { text, is_active, id } = req.body;

    const questions = await RecoveryQuestions.findOne({ where: { id: id } });

    if (!questions) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Questions Not Found!' });
    }

    let dtoUpdateRecoveryQuestions = {
      text,
      is_active: is_active
    };

    await RecoveryQuestions.update(dtoUpdateRecoveryQuestions, {
      where: { id: id }
    });

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Update Questions!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};
