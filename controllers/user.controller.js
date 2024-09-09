const { Op } = require('sequelize');

const User = require("../models/userModel");
const Payment = require('../models/paymentModel');


exports.getUser = async (req, res, next) => {
    try {
        const userDecoded = req?.user;

        const user = await User.findOne({ where: { id: userDecoded?.id } });

        if (!user) throw new Error('User not found!');

        const { password, nik, token, recovery_answer, recovery_question, ...result } = user?.dataValues;

        return res.status(200).json({ user: result });

        // const user = User.find
    } catch (error) {
        next(error)
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
        const offset = (page - 1) * limit;

        // Search query parameter
        const { search } = req.query;

        const whereCondition = {};

        if (search) {
            whereCondition[Op.or] = [
                { ref_id: { [Op.iLike]: `%${search}%` } },  // Case-insensitive for ref_id
                { username: { [Op.iLike]: `%${search}%` } },  // Case-insensitive for username
                { phone_number: { [Op.iLike]: `%${search}%` } }  // Case-insensitive for phone_number
            ];
        }

        const { count, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            attributes: { exclude: ['password', 'nik', 'token', 'recovery_answer', 'recovery_question'] },
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']], // Optional: to sort by creation date
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            users,
            currentPage: page,
            totalPages,
            totalItems: count,
        });
    } catch (error) {
        next(error);
    }
};

exports.getTransactionHistoryUser = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
        const offset = (page - 1) * limit;

        const { count, rows: users } = await Payment.findAndCountAll({
            where: { user_id_nero: req?.user?.id },
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            users,
            currentPage: page,
            totalPages,
            totalItems: count,
        });
    } catch (error) {
        next(error)
    }
}