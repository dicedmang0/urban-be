const { body, param, query, checkSchema, validationResult } = require('express-validator');

var Schema = {
  "role": {
    in: 'body',
    matches: {
      options: [/\b(?:superadmin|user|agent)\b/],
      errorMessage: "Invalid Role"
    }
  }
}

exports.validateRegister = [
  body('username').isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),
  // body('email', 'email is not valid').isEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body("recovery_question").isUUID().withMessage("recovery question is not valid"),
  body("recovery_answer").notEmpty().withMessage("recovery answer is required"),
  // body('phone_number').optional().isMobilePhone(['id-ID']).withMessage('Mobile phone number is invalid'),
  body('nik', 'nik is not valid').isInt().optional(),
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

exports.validateUserCheck = [
  body('username').isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
]

exports.validateAnswerCheck = [
  body('username').isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),
  body("recovery_question").isUUID().withMessage("recovery question is not valid"),
  body("recovery_answer").notEmpty().withMessage("recovery answer is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
]

exports.validateForgotPassword = [
  body('username').isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),
  body("recovery_question").isUUID().withMessage("recovery question is not valid"),
  body("recovery_answer").notEmpty().withMessage("recovery answer is required"),
  body("password").notEmpty().withMessage("password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
]

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
  body('ref_id', 'ref_id is not valid').isString().optional(),
  // body('phone_number').optional().isMobilePhone('id-ID').withMessage('Mobile phone number is invalid'),
  body('is_active', 'is_active is not valid').isBoolean(),
  body('agent_id', 'agent_id is not valid').isString().optional(),
  body('nik', 'nik is not valid').isInt().optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors,'???')
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
  // body('phone_number').optional().isMobilePhone(['id-ID']).withMessage('Mobile phone number is invalid'),
  body('agent_id', 'agent_id is not valid').isString().optional(),
  body('ref_id', 'ref_id is not valid').isString().optional(),
  body('nik', 'nik is not valid').isInt().optional(),
  checkSchema(Schema),
  // body('email', 'email is not valid').isEmail(),
  body('is_active', 'is_active is not valid').isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  }
];


exports.validateUpdateProfileUsers = [
  body('password').notEmpty().withMessage('Password is required'),
  body('id', 'id is not valid').isUUID(),
  // body('email', 'email is not valid').isEmail(),
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

