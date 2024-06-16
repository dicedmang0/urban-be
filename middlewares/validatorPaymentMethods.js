const {
  body,
  query,
  param,
  checkSchema,
  validationResult,
} = require("express-validator");

exports.validateAddPaymentMethod = [
    body("name").notEmpty().withMessage("name is required"),
    body('is_active').isBoolean().withMessage('is_active must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  },
];


exports.validateUpdatePaymentMethod = [
    body("name").notEmpty().withMessage("name is required"),
    body('is_active').isBoolean().withMessage('is_active must be a boolean'),
    param('id', 'id is not valid').isUUID(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  },
];

exports.validateAddPaymentMethodDetail = [
    body("name").notEmpty().withMessage("name is required"),
    body("code").notEmpty().withMessage("code is required"),
    body('paymentMethodId', 'paymentMethodId is not valid').isUUID(),
    body('is_active').isBoolean().withMessage('is_active must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  },
];

exports.validateUpdatePaymentMethodDetail = [
    param('id', 'id is not valid').isUUID(),
    body("name").notEmpty().withMessage("name is required"),
    body("code").notEmpty().withMessage("code is required"),
    body('paymentMethodId', 'paymentMethodId is not valid').isUUID(),
    body('is_active').isBoolean().withMessage('is_active must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "Bad Request", errors: errors.array() });
    }
    next();
  },
];
