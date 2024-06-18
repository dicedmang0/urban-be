// models/paymentMethodDetailModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const AgentModel = require("./agentModel"); // Import PaymentMethod model

const AgentDetail = sequelize.define(
  "Agents_Detail",
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    agentDetailsId: {  // Define foreign key column
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: AgentModel,  // Reference to PaymentMethod model
        key: 'id',
      }
    },
  },
  {
    timestamps: true,
  }
);

// Define the association
AgentDetail.belongsTo(AgentModel, {
  foreignKey: 'agentDetailsId',
  as: 'AgentDetails'
});

AgentModel.hasMany(AgentDetail, {
  foreignKey: 'agentDetailsId',
  as: 'AgentDetails'
});

module.exports = AgentDetail;
