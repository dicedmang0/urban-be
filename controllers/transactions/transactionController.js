const createError = require('http-errors');
const { topUpValidation } = require('../../libs/validations/transactions/topUpValidation');
const User = require('../../models/userModel');
const SPNGATEWAY = require('../../services/spnpayGateway');
const sequelize = require('../../config/database');
const Transaction = require('../../models/transactionModel');
const { getCodeUtil } = require('../../libs/utils/getCodeUtil');
const { typeTransaction } = require('../../libs/consts/typeTransaction');

exports.topUp = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {

        const user = req.user;
        // check user
        const checkUser = await User.findOne({ where: { id: user?.id } });
        if (!checkUser) return next(createError.Forbidden('User Not Found!'));

        const payload = await topUpValidation.validateAsync(req.body);
        const getCodeName = getCodeUtil(payload.payment_method, payload.code);
        payload.name = checkUser?.username;
        
        const result = await SPNGATEWAY.createTrxPayment(payload);

        payload.user_id = checkUser?.id;
        payload.code = getCodeName.code;
        payload.code_name = getCodeName.code_name;
        payload.fee = result?.fee;
        payload.additional_info = result?.additionalInfo
        payload.type = typeTransaction.TOP_UP;
        payload.trx_id = result?.id;
        payload.merchant_ref = result?.merchantRef;
        payload.expired_date = result?.expiredDate;
        

        await Transaction.create(payload, { transaction: t });
        await t.commit()

        return res.status(201).json({
            status: 201,
            message: "Success",
            data: result
        })
    } catch (error) {
        await t.rollback()
        return next(error)
    }
}