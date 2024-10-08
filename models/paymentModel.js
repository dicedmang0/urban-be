// models/userModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const AgentDetail = require("./agentDetailModel");

const Payment = sequelize.define(
  "Payments",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    merchant_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ref_id: { // for refferal
      type: DataTypes.STRING,
      allowNull: true,
    },
    nmid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id_nero: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fee: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fee_reff: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    package: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inquiry_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    server_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    request_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order_id_uniplay: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rrn: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = Payment;
