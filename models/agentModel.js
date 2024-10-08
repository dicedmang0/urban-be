// models/userModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Agents = sequelize.define(
  "Agents",
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
    fee: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0', // Set your desired default value here
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Agents;
