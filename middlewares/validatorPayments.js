const {
  body,
  query,
  param,
  checkSchema,
  validationResult,
} = require("express-validator");

var Schema = {
  payment_status: {
    in: "body",
    matches: {
      options: [/\b(?:Failed|Pending|Success)\b/],
      errorMessage: "Invalid Payment Status",
    },
  },
};

exports.validateGetPayment = [
  query("limit")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Limit must be an integer between 1 and 1000"),
  query("offset")
    .isInt({ min: 0 })
    .withMessage("Offset must be an integer of at least 0"),
  query("id").isUUID().withMessage("ID is not valid").optional(),
  query("paymentStatus")
    .isString()
    .withMessage("Payment status must be a string")
    .optional(),
  query("paymentMethod")
    .isString()
    .withMessage("Payment method must be a string")
    .optional(),
  query("startDate")
    .custom((value) => {
      if (!value || value === "") return true; // Allow empty string
      return /^\d{4}-\d{2}-\d{2}$/.test(value); // Validate YYYY-MM-DD format
    })
    .withMessage(
      "Start date must be a valid date in YYYY-MM-DD format or an empty string"
    )
    .optional(),
  query("endDate")
    .custom((value) => {
      if (!value || value === "") return true; // Allow empty string
      return /^\d{4}-\d{2}-\d{2}$/.test(value); // Validate YYYY-MM-DD format
    })
    .withMessage(
      "Start date must be a valid date in YYYY-MM-DD format or an empty string"
    )
    .optional(),
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

exports.validateAddPayment = [
  body("merchant_id").notEmpty().withMessage("merchant_id is required"),
  body("transaction_id").notEmpty().withMessage("transaction_id is required"),
  body("amount").notEmpty().withMessage("amount is required"),
  body("user_id", "id is not valid").isUUID(),
  body("game_id").notEmpty().withMessage("game_id is required"),
  body("payment_method").notEmpty().withMessage("payment_method is required"),
  body("payment_date").notEmpty().withMessage("payment_date is required"),
  body("requested_date").notEmpty().withMessage("request_date is required"),
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

exports.validateUpdatePayment = [
  body("payment_id", "payment_id is not valid").isUUID(),
  checkSchema(Schema),
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
