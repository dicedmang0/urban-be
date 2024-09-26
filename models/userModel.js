// models/userModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  ref_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  nik: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  agent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Agents',  // Name of the referenced table
      key: 'id'
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recovery_question: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recovery_answer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0
}
}, {
  timestamps: true,
});

module.exports = User;
