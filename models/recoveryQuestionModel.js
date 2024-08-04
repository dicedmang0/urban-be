// models/userModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecoveryQuestion = sequelize.define('Recovery_Questions', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = RecoveryQuestion;
