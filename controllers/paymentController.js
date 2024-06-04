// controllers/paymentController.js
const Payment = require("../models/paymentModel");

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findAll();
    res.status(201).json( payment );
  } catch (error) {
    res.status(500).send({message: error.message});
  }
};

exports.addPayment = async (req, res) => {
  try {
    
    const { merchant_id, transaction_id, user_id, game_id, amount, payment_method, payment_date, requested_date } = req.body;
    const dto = {
        merchant_id: merchant_id, 
        transaction_id: transaction_id,
        amount: amount,
        user_id: user_id,
        game_id: game_id,
        payment_method: payment_method,
        payment_date: payment_date,
        request_date: requested_date,
        payment_status: 'Pending'
    }
    const payment = await Payment.create(dto);
    res.status(201).json({message: "Success Adding Payment!"});
  } catch (error) {
    res.status(500).send({message: error.message});
  }
};
