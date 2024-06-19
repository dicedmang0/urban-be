const {
  body,
  query,
  param,
  checkSchema,
  validationResult,
} = require("express-validator");

exports.validateCreateAgent = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  // body("expired_at")
  //   .notEmpty()
  //   .withMessage("Expiration date is required")
  //   .isDate()
  //   .withMessage("Expiration date must be a valid date (YYYY-MM-DD)"),
  body("is_active")
    .notEmpty()
    .withMessage("Active status is required")
    .isBoolean()
    .withMessage("Active status must be a boolean"),
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

exports.validateIdAgent = [
  param("id", "id is not valid").isUUID(),
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

exports.validateUpdateAgent = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  // body("expired_at")
  //   .notEmpty()
  //   .withMessage("Expiration date is required")
  //   .isDate()
  //   .withMessage("Expiration date must be a valid date (YYYY-MM-DD)"),
  body("is_active")
    .notEmpty()
    .withMessage("Active status is required")
    .isBoolean()
    .withMessage("Active status must be a boolean"),
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

exports.validateGetAgent = [
  query("limit")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Limit must be an integer between 1 and 1000"),
  query("offset")
    .isInt({ min: 0 })
    .withMessage("Offset must be an integer of at least 0"),
  query("name").isString().withMessage("name must be a string").optional(),
  query("is_active")
    .isBoolean()
    .withMessage("is_active must be a boolean")
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

exports.validateAddAgentDetail = [
  body("name").notEmpty().withMessage("name is required"),
  body("code").notEmpty().withMessage("code is required"),
  body("agentDetailsId", "agentDetailsId is not valid").isUUID(),
  body("is_active").isBoolean().withMessage("is_active must be a boolean"),
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

exports.validateUpdateAgentDetail = [
  param("id", "id is not valid").isUUID(),
  body("name").notEmpty().withMessage("name is required"),
  body("code").notEmpty().withMessage("code is required"),
  body("agentDetailsId", "agentDetailsId is not valid").isUUID(),
  body("is_active").isBoolean().withMessage("is_active must be a boolean"),
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
