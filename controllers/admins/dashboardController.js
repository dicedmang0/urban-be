const moment = require('moment');
const { Op } = require("sequelize");
const Payment = require('../../models/paymentModel');

exports.dashboard = async (req, res) => {
    try {
      const { range = 7, status } = req.body;
  
      // Get today date
      const today = moment().startOf('day').toDate(); // 00:00 of today
      const tomorrow = moment().endOf('day').toDate(); // 23:59 of today
  
      // Get range date from today
      const startDate = moment().subtract(range, 'days').startOf('day').toDate(); // Start date
      const endDate = moment().endOf('day').toDate(); // End of today
  
      // Filter for the current day
      let dailyFilter = {
        request_date: {
          [Op.between]: [today, tomorrow],
        },
      };
  
      // Filter for the range
      let rangeFilter = {
        request_date: {
          [Op.between]: [startDate, endDate],
        },
      };
  
      if (status) {
        dailyFilter.payment_status = status;
        rangeFilter.payment_status = status;
      }
  
      const dailyPayments = await Payment.count({ where: dailyFilter });
  
      const rangePayments = await Payment.count({ where: rangeFilter });
  
      return res.status(200).json({
        success: true,
        message: "Payments fetched successfully",
        data: {
          today: dailyPayments,
          rangeDate: rangePayments,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching payments",
      });
    }
  };