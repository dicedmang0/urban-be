const moment = require('moment');
const { Op, fn, col, cast } = require("sequelize");
const Payment = require('../../models/paymentModel');

exports.dashboard = async (req, res) => {
  try {
    const { range = 7 } = req.body;

    
    const startDate = moment().subtract(range, 'days').startOf('day').toDate();
    const endDate = moment().endOf('day').toDate();

    
    let rangeFilter = {
      request_date: {
        [Op.between]: [startDate, endDate],
      },
    };

    
    const paymentsGrouped = await Payment.findAll({
      where: rangeFilter,
      attributes: [
        [fn('DATE', col('request_date')), 'date'],
        'payment_status',
        [fn('COUNT', col('id')), 'count'],
        [fn('AVG', cast(col('amount'), 'DECIMAL')), 'avg_amount'], 
      ],
      group: ['date', 'payment_status'],
      order: [['date', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: paymentsGrouped,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching payments",
    });
  }
};
