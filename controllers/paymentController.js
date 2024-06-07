// controllers/paymentController.js
const Payment = require("../models/paymentModel");

exports.getPayment = async (req, res) => {
  try {
    const { id, limit, offset } = req.query;

    // Construct the query options
    let queryOptions = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    };

    // If an ID is provided, add it to the query options
    if (id) {
      queryOptions.where = { id: id };
    }

    const payment = await Payment.findAll(queryOptions);
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const {
      merchant_id,
      transaction_id,
      user_id,
      game_id,
      amount,
      payment_method,
      payment_date,
      requested_date,
    } = req.body;
    const dto = {
      merchant_id: merchant_id,
      transaction_id: transaction_id,
      amount: amount,
      user_id: user_id,
      game_id: game_id,
      payment_method: payment_method,
      payment_date: payment_date,
      request_date: requested_date,
      payment_status: "Pending",
    };

    await Payment.create(dto);

    res
      .status(200)
      .json({ status: "Success", message: "Success Adding Payment!" });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { payment_id, payment_status } = req.body;
    const dto = {
      payment_status: payment_status,
    };

    const payment = await Payment.findOne({ where: { id: payment_id } });

    if (!payment) {
      return res
        .status(400)
        .send({ status: "Bad Request", message: "Payment Not Found" });
    }

    await Payment.update(dto, { where: { id: payment_id } });

    res
      .status(200)
      .json({ status: "Success", message: "Success Updating Payment!" });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};
