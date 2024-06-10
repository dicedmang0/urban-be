// models/paymentMethodDetailModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const PaymentMethod = require("./paymentMethodModel"); // Import PaymentMethod model

const PaymentMethodDetail = sequelize.define(
  "Payment_Methods_Detail",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethodId: {  // Define foreign key column
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: PaymentMethod,  // Reference to PaymentMethod model
        key: 'id',
      }
    },
  },
  {
    timestamps: true,
  }
);

// Define the association
PaymentMethodDetail.belongsTo(PaymentMethod, {
  foreignKey: 'paymentMethodId',
  as: 'paymentMethod'
});

PaymentMethod.hasMany(PaymentMethodDetail, {
  foreignKey: 'paymentMethodId',
  as: 'paymentMethodDetails'
});

module.exports = PaymentMethodDetail;
