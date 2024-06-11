const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

function getGameModel(gameId) {
  return sequelize.define(gameId, {
    user_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
    },
    save_data: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    coin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });
}

module.exports = getGameModel;
