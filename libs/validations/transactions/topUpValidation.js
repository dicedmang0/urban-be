const Joi = require('joi');

exports.topUpValidation = Joi.object({
    amount: Joi.number().required(),
    phone_number: Joi.string().required(),
    payment_method: Joi.string().valid('e-wallet', 'virtual-account', 'qris', 'credit-card').required().required(),
    code: Joi.string().required(),
    ref_id: Joi.string().optional().allow("")
})