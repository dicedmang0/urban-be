const { Op, fn, col, cast } = require("sequelize");
const Payment = require('../../models/paymentModel');
const moment = require('moment-timezone');

exports.dashboard = async (req, res) => {
  try {
    const { range = 7 } = req.body;

    // Set the start and end dates in Asia/Jakarta timezone
    const startDate = moment.tz('Asia/Jakarta').subtract(range, 'days').startOf('day').toDate();
    const endDate = moment.tz('Asia/Jakarta').endOf('day').toDate();

    // Construct the range filter using Jakarta timezone-adjusted dates
    let rangeFilter = {
      request_date: {
        [Op.between]: [startDate, endDate],
      },
    };

    // Fetch and group payments by date and status
    const paymentsGrouped = await Payment.findAll({
      where: rangeFilter,
      attributes: [
        [fn('DATE', col('request_date')), 'date'],  // Group by date
        'payment_status',
        [fn('COUNT', col('id')), 'count'],
        [fn('AVG', cast(col('amount'), 'DECIMAL')), 'avg_amount'], // Calculate average amount
      ],
      group: ['date', 'payment_status'],
      order: [['date', 'ASC']],
    });

    // Format the dates in 'YYYY-MM-DD HH:mm:ss+07' format for the response
    const formattedPayments = paymentsGrouped.map(payment => ({
      ...payment.dataValues,
      date: moment.tz(payment.dataValues.date, 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss+07'),
    }));

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: formattedPayments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching payments",
    });
  }
};