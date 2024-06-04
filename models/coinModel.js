// models/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coin = sequelize.define('Coin', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Coin;
