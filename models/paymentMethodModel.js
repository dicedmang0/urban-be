// models/userModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PaymentMethod = sequelize.define(
  "Payment_Methods",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = PaymentMethod;
