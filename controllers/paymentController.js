// controllers/paymentController.js
const Payment = require("../models/paymentModel");
const PaymentMethodDetail = require("../models/paymentMethodDetailModel");
const PaymentMethod = require("../models/paymentMethodModel");
const { Op } = require("sequelize"); // Import Op from Sequelize
const { v4: uuidv4 } = require("uuid");
const {
  cronosQris,
  cronosVirtualAccount,
  cronosEWallet,
} = require("../services/cronosGateway");

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

    res.status(200).json({ payments, totalCount });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const {
      ref_id,
      transaction_id,
      user_id,
      name,
      game_id,
      amount,
      payment_method,
      requested_date,
      phone_number,
      nmid
    } = req.body;

    const dto = {
      ref_id: ref_id || uuidv4(),
      transaction_id: transaction_id || uuidv4(),
      amount: amount,
      user_id: user_id,
      name: name,
      game_id: game_id,
      nmid: nmid,
      payment_method: payment_method,
      phone_number: phone_number,
      payment_date: null,
      request_date: requested_date,
      payment_status: "Pending",
    };

    const resp = await sendCronosGateway(dto);

    await Payment.create(dto);

    res.status(200).json({
      status: "Success",
      message: "Success Adding Payment!",
      data: resp.responseData,
    });
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

const sendCronosGateway = async (object) => {
  try {
    if (object.payment_method == "Virtual Account") {
      const detailPaymentMethod = await PaymentMethodDetail.findOne({
        where: { code: object.code },
      });

      if (detailPaymentMethod) {
        const paymentMethod = await PaymentMethod.findOne({
          where: { id: detailPaymentMethod.paymentMethodId },
        });

        if (paymentMethod) {
          if (paymentMethod.name == object.payment_method) {
            const dto = {
              bankCode: object.code,
              singleUse: true,
              type: "ClosedAmount",
              reference: object.transaction_id,
              amount: object.amount,
              expiryMinutes: 30,
              viewName: object.name,
              additionalInfo: {
                callback: "https://kraken.free.beeceptor.com/notify",
              },
            };
            const response = await cronosVirtualAccount(dto);
            return response;
          } else {
            throw { message: "Methods is not the same." };
          }
        } else {
          throw { message: "Methods is not available." };
        }
      } else {
        throw { message: "Bank Code is not available" };
      }

      // await PaymentMethodDetail.
    } else if (object.payment_method == "E-Wallet") {
      const detailPaymentMethod = await PaymentMethodDetail.findOne({
        where: { code: object.code },
      });

      if (detailPaymentMethod) {
        const paymentMethod = await PaymentMethod.findOne({
          where: { id: detailPaymentMethod.paymentMethodId },
        });

        if (paymentMethod) {
          if (paymentMethod.name == object.payment_method) {
            const dto = {
              phoneNumber: object.phone_number,
              channel: object.code,
              reference: object.transaction_id,
              amount: object.amount,
              expiryMinutes: 30,
              viewName: object.name,
              additionalInfo: {
                callback: "https://kraken.free.beeceptor.com/notify",
              },
            };
            const response = await cronosEWallet(dto);
            return response;
          } else {
            throw { message: "Methods is not the same." };
          }
        } else {
          throw { message: "Methods is not available." };
        }
      } else {
        throw { message: "Channel is not available" };
      }
    } else if (object.payment_method == "Qris") {
      const dto = {
        reference: object.transaction_id,
        amount: object.amount,
        expiryMinutes: 30,
        viewName: object.name,
        additionalInfo: {
          callback: "https://kraken.free.beeceptor.com/notify",
        },
      };

      const response = await cronosQris(dto);
      return response;
    } else if (object.payment_method == "Retail") {
      const detailPaymentMethod = await PaymentMethodDetail.findOne({
        where: { code: object.code },
      });

      if (detailPaymentMethod) {
        const paymentMethod = await PaymentMethod.findOne({
          where: { id: detailPaymentMethod.paymentMethodId },
        });

        if (paymentMethod) {
          if (paymentMethod.name == object.payment_method) {
            const dto = {
              phoneNumber: object.phone_number,
              channel: object.code,
              reference: object.transaction_id,
              amount: object.amount,
              expiryMinutes: 30,
              viewName: object.name,
              additionalInfo: {
                callback: "https://kraken.free.beeceptor.com/notify",
              },
            };
            const response = await cronosEWallet(dto);
            return response;
          } else {
            throw { message: "Methods is not the same." };
          }
        } else {
          throw { message: "Methods is not available." };
        }
      } else {
        throw { message: "Channel is not available" };
      }
    } else if (object.payment_method == "Credit Card") {
      const dto = {
        reference: object.transaction_id,
        phoneNumber: object.phone_number,
        amount: object.amount,
        expiryMinutes: 30,
        viewName: object.name,
        additionalInfo: {
          callback: "https://kraken.free.beeceptor.com/notify",
        },
      };
      const response = await cronosEWallet(dto);
      return response;
    } else {
      throw { message: "Something Wrong with server." };
    }
  } catch (error) {
    throw error;
  }
};
