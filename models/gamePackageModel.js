// models/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GamePackage = sequelize.define(
  'GamePackages',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
        type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    check_username: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    use_virtual_account: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    use_qris: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    use_ewallet: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    use_credit_card: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    use_retail: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    use_uniplay: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = GamePackage;
