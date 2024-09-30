const createError = require('http-errors');
const { topUpValidation } = require('../../libs/validations/transactions/topUpValidation');
const User = require('../../models/userModel');
const SPNGATEWAY = require('../../services/spnpayGateway');
const sequelize = require('../../config/database');
const Transaction = require('../../models/transactionModel');
const { getCodeUtil } = require('../../libs/utils/getCodeUtil');
const { typeTransaction, statusTransaction } = require('../../libs/consts/typeTransaction');
const { getStatusTrx } = require('../../libs/helpers/getStatusTrx');

exports.topUp = async (req, res, next) => {
    // const t = await sequelize.transaction();
    try {

        const user = req.user;
        // check user
        const checkUser = await User.findOne({ where: { id: user?.id } });
        if (!checkUser) return next(createError.Forbidden('User Not Found!'));

        const payload = await topUpValidation.validateAsync(req.body);
        const getCodeName = getCodeUtil(payload.payment_method, payload.code);
        payload.name = checkUser?.username;

        const result = await SPNGATEWAY.createTrxPayment(payload);

        console.log(result);
        

        if (!result) {
            return next(createError.InternalServerError('Empty Response From SPNPAY!'));
        }

        payload.user_id = checkUser?.id;
        payload.code = getCodeName.code;
        payload.code_name = getCodeName.code_name;
        // payload.fee = result?.fee;
        payload.additional_info = result?.additionalInfo
        payload.type = typeTransaction.TOP_UP;
        payload.trx_id = result?.id;
        payload.merchant_ref = result?.merchantRef;
        payload.expired_date = result?.expiredDate;


        await Transaction.create(payload);
        // await t.commit()

        return res.status(201).json({
            status: 201,
            message: "Success",
            data: result
        })
    } catch (error) {
        console.log('error', error);
        // await t.rollback()
        return next(error)
    }
}

exports.callback = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const payload = req.body;

        const trx = await Transaction.findOne({ where: { trx_id: payload?.responseData?.id } });
        if (!trx) return createError.BadRequest('Trx Not Found!');

        const trxStatus = getStatusTrx(payload?.responseData?.status);
        const newData = { status: trxStatus };

        // if status success & response 
        if (trxStatus === statusTransaction.SUCCESS && payload?.responseData?.paidDate) {
            // if paid_date in trx is null or not completed payment
            if (!trx.paid_date) {
                newData.paid_date = payload?.responseData?.paidDate;
                const user = await User.findOne({ where: { id: trx?.user_id } });
                
                if (!user) return createError.Forbidden('User Not Found!');
                
                await Transaction.update({ ...newData }, { where: { trx_id: payload?.responseData?.id }, transaction: t });
                await User.update({ amount: Number(Number(user?.amount) + Number(trx.amount)) }, { where: { id: trx.user_id }, transaction: t })
            }
            
        }

        if (trxStatus !== statusTransaction.SUCCESS) {
            await Transaction.update({ ...newData }, { where: { trx_id: payload?.responseData?.id }, transaction: t });
        }


        await t.commit();

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: payload
        })
    } catch (error) {
        console.log('error', error);
        
        await t.rollback()
        return next(error)
    }
}

// response callback
// {
//     responseCode: 200,
//         responseMessage: 'success',
//             responseData: {
//         id: 'ff017916-605d-4b4c-a5af-6397f539753c',
//             merchantRef: '049bbfb4-765c-4cae-a8c0-af47873f9341',
//                 status: 'pending',
//                     feePayer: 'merchant',
//                         amount: 53207,
//                             fee: 1597,
//                                 totalAmount: 53207,
//                                     expiredDate: '2024-09-27T15:34:11+07:00',
//                                         paidDate: null,
//                                             settleDate: '2024-09-27T15:04:11+07:00',
//                                                 additionalInfo: {
//             callback: 'https://m9fdg0jl-4001.asse.devtunnels.ms/api/callback-trx'
//         },
//         eWallet: {
//             viewName: 'wkwkwk',
//                 channel: 'ovo',
//                     url: 'http://conn.com/id-iusto-ipsum-aut-minima-enim-eos'
//         }
//     }
// }