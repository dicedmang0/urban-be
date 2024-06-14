const {
  body,
  param,
  query,
  checkSchema,
  validationResult
} = require('express-validator');
const User = require('../models/userModel');
const { gameIds } = require('../config/initializeGameModel');
const getGameModel = require('../models/gameModel');

exports.validateGameId = [
  param('gameId').isIn(gameIds).withMessage('Invalid game ID.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: 'Bad Request', errors: errors.array() });
    }
    next();
  }
];

exports.validateUserExist = [
  body('user_id')
    .custom((value) => {
      return User.findOne({ where: { id: value } }).then((user) => {
        if (!user) {
          return Promise.reject('User does not exist.');
        }
      });
    })
    .withMessage('User does not exist.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: 'Bad Request', errors: errors.array() });
    }
    next();
  }
];

exports.validateUserAlreadyAdded = [
  body('user_id')
    .custom((value, { req }) => {
      const Game = getGameModel('game_' + req.params.gameId);
      return Game.findOne({ where: { user_id: value } }).then((user) => {
        if (user) {
          return Promise.reject('User already added to the gam.');
        }
      });
    })
    .withMessage('User already added to the game.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: 'Bad Request', errors: errors.array() });
    }
    next();
  }
];

exports.validateSaveData = [
  body('save_data')
    .custom((value) => {
      if (typeof value === 'string') {
        // If it's a string, we try to parse it to see if it's a JSON string
        try {
          JSON.parse(value);
          return true;
        } catch (err) {
          // If parsing fails, it's not a valid JSON string
          return false;
        }
      }
      // If it's neither an object nor a string, it's not valid
      return false;
    })
    .withMessage('Save data must be a JSON string.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: 'Bad Request', errors: errors.array() });
    }
    next();
  }
];

exports.validateCoin = [
  body('coin')
    .isInt({ min: 0 })
    .withMessage('Coin must be a non-negative integer.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: 'Bad Request', errors: errors.array() });
    }
    next();
  }
];

exports.validateHasEnoughCoin = [
  body('coin')
    .custom((value, { req }) => {
      const Game = getGameModel('game_' + req.params.gameId);
      return Game.findOne({ where: { user_id: req.params.idUser } }).then(
        (game) => {
          if (game.coin < value) {
            return Promise.reject('Not enough coin.');
          }
        }
      );
    })
    .withMessage('Not enough coin.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: 'Bad Request', errors: errors.array() });
    }
    next();
  }
];
