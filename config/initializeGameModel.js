const getGameModel = require("../models/gameModel");

// Define game model here
const gameIds = ["idlemarket", "sugarpuff"];

const initGameModel = async () => {
  try {
    for (let i = 0; i < gameIds.length; i++) {
      await getGameModel("game_" + gameIds[i]);
    }

    console.log("Game Model Initialized");
  } catch (error) {
    console.error(error);
  }
};

module.exports = initGameModel;
