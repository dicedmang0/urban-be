const getGameModel = require('../models/gameModel');
const User = require('../models/userModel');
const sequelize = require('../config/database');

async function createNewUser(game_id, user_id) {
  const gameModel = getGameModel(game_id);
  return gameModel.create({
    user_id,
    save_data: '{}',
    coin: 0
  });
}

async function getHighscores(game_id) {
  const query = `
    SELECT u.username AS "user_id", g.highscore
    FROM ${game_id}s AS g
    JOIN public."Users" AS u ON g.user_id = u.id::text
    ORDER BY g.highscore DESC
    LIMIT 10;
  `;

  const results = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT
  });

  // only return where highscore is higher than 0
  return results.filter((result) => result.highscore > 0);
}

exports.incrementCoin = async (game_id, user_id, coin_amount) => {
  game_id = 'game_' + game_id;
  const gameModel = getGameModel(game_id);
  let game = await gameModel.findOne({ where: { user_id } });

  if (!game) {
    game = await createNewUser(game_id, user_id);
  }

  await game.increment('coin', { by: coin_amount });
};

exports.getHighscores = async (req, res) => {
  try {
    const game_id = 'game_' + req.params.gameId;

    const highscores = await getHighscores(game_id);

    res.status(200).json({ status: 'Success', data: highscores });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.setHighscore = async (req, res) => {
  try {
    const game_id = 'game_' + req.params.gameId;
    const user_id = req.params.idUser;
    const gameModel = getGameModel(game_id);

    let game = await gameModel.findOne({ where: { user_id } });

    if (!game) {
      game = await createNewUser(game_id, user_id);
    }

    const { highscore } = req.body;

    await game.update({ highscore });

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Set Highscore!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.addNewUser = async (req, res) => {
  try {
    const game_id = 'game_' + req.params.gameId;
    const { user_id } = req.body;

    await createNewUser(game_id, user_id);

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Add New User' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.getUserSaveData = async (req, res) => {
  try {
    const game_id = 'game_' + req.params.gameId;
    const user_id = req.params.idUser;
    const gameModel = getGameModel(game_id);

    let game = await gameModel.findOne({ where: { user_id } });

    if (!game) {
      game = await createNewUser(game_id, user_id);
    }

    res.status(200).json({ status: 'Success', data: game });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.updateSaveData = async (req, res) => {
  try {
    const game_id = 'game_' + req.params.gameId;
    const user_id = req.params.idUser;
    const { save_data } = req.body;
    const gameModel = getGameModel(game_id);

    let game = await gameModel.findOne({ where: { user_id } });

    if (!game) {
      game = await createNewUser(game_id, user_id);
    }

    await game.update({ save_data });

    res.status(200).json({ status: 'Success', data: game });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.addCoin = async (req, res) => {
  try {
    const game_id = 'game_' + req.params.gameId;
    const user_id = req.params.idUser;
    const { coin } = req.body;
    const gameModel = getGameModel(game_id);

    let game = await gameModel.findOne({ where: { user_id } });

    if (!game) {
      game = await createNewUser(game_id, user_id);
    }

    await game.increment('coin', { by: coin });

    res.status(200).json({ status: 'Success', message: 'Success Add Coin!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.deductCoin = async (req, res) => {
  try {
    const game_id = 'game_' + req.params.gameId;
    const user_id = req.params.idUser;
    const { coin } = req.body;
    const gameModel = getGameModel(game_id);

    let game = await gameModel.findOne({ where: { user_id } });

    if (!game) {
      game = await createNewUser(game_id, user_id);
    }

    await game.decrement('coin', { by: coin });

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Deduct Coin!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};
