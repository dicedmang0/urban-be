const { body, param, query, checkSchema, validationResult } = require('express-validator');

var Schema = {
  "role": {
    in: 'body',
    matches: {
      options: [/\b(?:Superadmin|User)\b/],
      errorMessage: "Invalid Role"
    }
  }
}

exports.validateRegister = [
  body('username').isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),
  body('email', 'email is not valid').isEmail(),
  body('password').isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
];

exports.validateRegisterUserRandom = [
  body('username').isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
];

exports.validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
];

exports.validateAddUsers = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  checkSchema(Schema),
  // body('email', 'email is not valid').isEmail(),
  body('is_active', 'is_active is not valid').isBoolean(),
  body('agent_id', 'agent_id is not valid').isUUID(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
];

exports.validateUpdateUsers = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('id', 'id is not valid').isUUID(),
  body('agent_id', 'agent_id is not valid').isUUID(),
  checkSchema(Schema),
  body('email', 'email is not valid').isEmail(),
  body('is_active', 'is_active is not valid').isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
];

exports.validateUsers = [
  param('idUser', 'id is not valid').isUUID(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
];

exports.validateGetUsers = [
  query("limit")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Limit must be an integer between 1 and 1000"),
  query("offset")
    .isInt({ min: 0 })
    .withMessage("Offset must be an integer of at least 0"),
  query("id").isUUID().withMessage("ID is not valid").optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
];

