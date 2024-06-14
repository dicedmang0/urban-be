const getGameModel = require('../models/gameModel');

async function createNewUser(game_id, user_id) {
  const gameModel = getGameModel(game_id);
  return gameModel.create({
    user_id,
    save_data: '{}',
    coin: 0
  });
}

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

    const game = await gameModel.findOne({ where: { user_id } });

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

    const game = await gameModel.findOne({ where: { user_id } });

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

    const game = await gameModel.findOne({ where: { user_id } });

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

    const game = await gameModel.findOne({ where: { user_id } });

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
