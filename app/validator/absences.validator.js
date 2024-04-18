const Joi = require('joi');

exports.ClockedIn = async (dto) => {
    const schema = Joi.object({
        clocked_in: Joi.string().required(),
        date: Joi.string().required(),
        status: Joi.string().required()
    }).required();

    try {
        const response = await schema.validateAsync(dto);
        return response;
    } catch (error) {
        throw error;
    }
};

exports.ClockedOut = async (dto) => {

    const schema = Joi.object({
        clocked_out: Joi.string().required(),
        date: Joi.string().required(),
        status: Joi.string().required()
    }).required();

    try {
        const response = await schema.validateAsync(dto);
        return response;
    } catch (error) {
        throw error;
    }
};

exports.findAbsencesById = async (dto) => {

    const schema = Joi.object({
        user_id: Joi.string().guid({ version: ['uuidv4']}).required(),
        date: Joi.string().required(),
    }).required();

    try {
        const response = await schema.validateAsync(dto);
        return response;
    } catch (error) {
        throw error;
    }
};

exports.findAbsencesByUserIdOnly = async (dto) => {

    const schema = Joi.object({
        user_id: Joi.string().guid({ version: ['uuidv4']}).required(),
        month: Joi.string().required()
    }).required();

    try {
        const response = await schema.validateAsync(dto);
        return response;
    } catch (error) {
        throw error;
    }
};

exports.findAbsencesByDate = async (dto) => {

    const schema = Joi.object({
        dateFrom: Joi.string().required(),
        dateTo: Joi.string().required()
    }).required();

    try {
        const response = await schema.validateAsync(dto);
        return response;
    } catch (error) {
        throw error;
    }
};


