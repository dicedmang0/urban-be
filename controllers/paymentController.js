// controllers/paymentController.js
const Payment = require("../models/paymentModel");
const { Op } = require("sequelize"); // Import Op from Sequelize

exports.getAllPayment = async (req, res) => {
  try {
    const payment = await Payment.findAll();
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const {
      id,
      limit,
      offset,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
    } = req.query;

    // Construct the query options
    let queryOptions = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      where: {},
    };

    if (id) {
      queryOptions.where.id = id;
    }

    // If a status is provided, add it to the query options
    if (paymentStatus) {
      queryOptions.where.payment_status = paymentStatus;
    }

    // If methods are provided, add them to the query options
    if (paymentMethod) {
      queryOptions.where.payment_method = paymentMethod;
    }

    // If a date range is provided, add it to the query options
    if (startDate && endDate) {
      queryOptions.where.payment_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const payments = await Payment.findAll(queryOptions);

    // Count total items without limit and offset
    const totalCount = await Payment.count({
      where: queryOptions.where,
    });
    
    res.status(200).json({payments, totalCount});
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
