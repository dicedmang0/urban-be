// controllers/userController.js
const RulePayment = require('../models/rulePaymentModel');

exports.getRulePayment = async (req, res) => {
  try {
    const queryOptions = {
      where: {
        code: req.params.code,
        is_active: true
      }
    };
    const users = await RulePayment.findAll(queryOptions);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.addRulePayment = async (req, res) => {
  try {
    const { code, description, value, is_active } = req.body;

    await RulePayment.create({
      code,
      description,
      value,
      is_active: is_active
    });

    res.status(200).json({ status: 'Success', message: 'Success Add Rule' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.updateRulePayment = async (req, res) => {
  try {
    const { code, description, value, is_active, id } = req.body;

    const Rule = await RulePayment.findOne({ where: { id: id } });

    if (!Rule) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Rule Not Found!' });
    }

    let dtoUpdateRulePayment = {
      code,
      description,
      value,
      is_active: is_active
    };

    await RulePayment.update(dtoUpdateRulePayment, {
      where: { id: id }
    });

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Update Rule!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};
