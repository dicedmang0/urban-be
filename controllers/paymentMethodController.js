const PaymentMethodDetail = require("../models/paymentMethodDetailModel");
const PaymentMethod = require("../models/paymentMethodModel");
const { Op } = require("sequelize"); // Import Op from Sequelize

exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.findAll({
      where: {
        [Op.or]: [
          { is_active: true }, // Active payment methods
          { "$paymentMethodDetails.is_active$": true }, // Active payment method details
        ],
      },
      include: [
        {
          model: PaymentMethodDetail,
          as: "paymentMethodDetails",
          attributes: ["id", "code", "name", "is_active", "paymentMethodId"],
          where: {
            is_active: true, // Ensure only active details are included
          },
          required: false, // This allows PaymentMethods without active details to be included if they are active
        },
      ],
    });

    res.status(200).json({ paymentMethods });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

// Add Payment Method
exports.addPaymentMethod = async (req, res) => {
  try {
    const { name, is_active } = req.body;
    await PaymentMethod.create({ name, is_active });
    res.status(200).json({
      status: "Success",
      message: "Success Adding Payment Method!",
    });
  } catch (error) {
    res.status(400).json({ status: "Bad Request", message: error.message });
  }
};

// Update Payment Method
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (paymentMethod) {
      paymentMethod.name = name;
      paymentMethod.is_active = is_active;
      await paymentMethod.save();
      res.status(200).json({
        status: "Success",
        message: "Success Update Payment Method!",
      });
    } else {
      res
        .status(400)
        .json({ status: "Bad Request", message: "Payment Method Not Found" });
    }
  } catch (error) {
    res.status(400).json({ status: "Bad Request", message: error.message });
  }
};

exports.addPaymentMethodDetail = async (req, res) => {
  try {
    const { code, name, is_active, paymentMethodId } = req.body;
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);
    if(!paymentMethod) {
        throw { message: "Payment Method not found"}
    }
    
    await PaymentMethodDetail.create({
      code,
      name,
      is_active,
      paymentMethodId,
    });
    res.status(200).json({
      status: "Success",
      message: "Success Adding Payment Method Detail!",
    });
  } catch (error) {
    res.status(400).json({ status: "Bad Request", message: error.message });
  }
};

// Update Payment Method Detail
exports.updatePaymentMethodDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, is_active, paymentMethodId } = req.body;
    const paymentMethodDetail = await PaymentMethodDetail.findByPk(id);
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);
    if(!paymentMethod) {
        throw { message: "Payment Method not found"}
    }

    if (paymentMethodDetail) {
      paymentMethodDetail.code = code;
      paymentMethodDetail.name = name;
      paymentMethodDetail.is_active = is_active;
      paymentMethodDetail.paymentMethodId = paymentMethodId;
      await paymentMethodDetail.save();
      res
        .status(200)
        .json({
          status: "Success",
          message: "Success Updating Payment Method Detail!",
        });
    } else {
      res
        .status(400)
        .json({
          status: "Bad Request",
          error: "Payment Method Detail not found",
        });
    }
  } catch (error) {
    res.status(400).json({ status: "Bad Request", message: error.message });
  }
};
