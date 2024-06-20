// models/paymentMethodDetailModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Agent = require("./agentModel"); // Import PaymentMethod model
const Payment = require("./paymentModel");

const AgentDetail = sequelize.define(
  "Agents_Detail",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    code: { // this is for NMID
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
        model: Agent,  // Reference to PaymentMethod model
        key: 'id',
      }
    },
  },
  {
    timestamps: true,
  }
);

// Define the association
AgentDetail.belongsTo(Agent, {
  foreignKey: 'agentDetailsId',
  as: 'AgentDetails'
});

Agent.hasMany(AgentDetail, {
  foreignKey: 'agentDetailsId',
  as: 'AgentDetails'
});

module.exports = AgentDetail;
