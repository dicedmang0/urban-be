const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const { statusTransaction } = require('../libs/consts/typeTransaction');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    trx_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: statusTransaction.PENDING
    },
    fee: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
    },
    fee_reff: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    code_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    additional_info: {
        type: DataTypes.JSON,
        allowNull: true
    },
    merchant_ref: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expired_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    paid_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    // Relation
    user_id: { // This will be the foreign key
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, { timestamps: true });

module.exports = Transaction;
