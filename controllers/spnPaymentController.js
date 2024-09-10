const Agents = require("../models/agentModel");
const GamePackage = require("../models/gamePackageModel");
const RulePayment = require("../models/rulePaymentModel");
const User = require("../models/userModel");
const SPNGATEWAY = require("../services/spnpayGateway");
const { getCodeUtil } = require("../utils/getCodeUtil");
const Payment = require("../models/paymentModel");
const { getInquiryDTU, postInquiryPayment } = require("../services/unipinGateway");
const { getStatusPayment } = require("../utils/getStatusPaymentUtil");


exports.paymentTrx = async (req, res, next) => {
    try {

        const user = req?.user;

        const checkUser = await User.findOne({ where: { id: user?.id } });

        if (!checkUser) throw new Error('User not Found!');

        const getCodeName = getCodeUtil(req?.body?.payment_method, req?.body?.code);

        const data = {
            ...req.body,
            ...getCodeName,
            name: req.body?.name ?? checkUser?.username ?? "-",
            user_id_nero: user?.id,
            ref_id: req?.body?.ref_id,
            payment_status: 'Pending',
            fee_reff: 0,
        }

        // Get Fee
        const getFeeRule = await RulePayment.findOne({ where: { code: '001', is_active: true } });
        const fee = Math.floor((Number(data?.amount ?? 0) * Number(getFeeRule?.value ?? 0)) / 100);
        const newPriceWithFee = parseInt(Number(data?.amount ?? 0), 10) + fee;

        // check refferal agent
        const user_agent = await User.findOne({ where: { ref_id: data?.ref_id } });

        if (!user_agent) data.ref_id = null;

        if (user_agent) {
            const getAgent = await Agents.findOne({ where: { id: user_agent?.agent_id } });

            if (getAgent) {
                data.fee_reff = Math.floor(( priceWithFee * getAgent?.fee ?? 0 ) / 100);
            }
        }

        // isGameHasToCheck
        const isGameHasToCheck = await GamePackage.findOne({
            where: {
              is_active: true,
              name: data?.game_id
            }
          });

        if (!isGameHasToCheck) throw new Error('Your Game is not available!');

        
        // if use uniplay and check game, choose package
        let payloadUniplay = {}
        if (isGameHasToCheck?.use_uniplay) {
            const responseDTU = await getInquiryDTU();
            const chooseGame = responseDTU?.list_dtu?.find((val) => val?.name === isGameHasToCheck?.title);
            const checkListDenom = chooseGame?.denom?.find((val) => val?.package === data?.package);
            
            if (!chooseGame || !checkListDenom || checkListDenom?.price !== data?.amount) throw Error('Game or package not found!');
           
            // set new fee and amount
            data.amount = newPriceWithFee;
            data.fee = fee;

            payloadUniplay = {
                isPassed: true,
                entitas_id: chooseGame.id,
                denom_id: checkListDenom.id,
                user_id: data.user_id,
                server_id: data.server_id
            }
        }
        
        const result = await SPNGATEWAY.createTrxPayment(data);
        
        // fetch to uniplay
        if (result && isGameHasToCheck?.use_uniplay && payloadUniplay?.isPassed) {
            const responseUniPlay = await postInquiryPayment(payloadUniplay);
            if (!responseUniPlay?.inquiry_id) {
                throw {
                  message: responseUniPlay?.message
                };
              }
            data.inquiry_id = responseUniPlay?.inquiry_id;
        }

        data.merchant_id = result?.merchantRef;
        data.transaction_id = result?.id;
        data.rrn = result?.additionalInfo?.rrn ?? null;
        data.request_date = result?.settleDate;

        await Payment.create(data);
        
        return res.status(200).json({
            status: true,
            message: 'Success',
            data: result
        })
    } catch (error) {
        console.log("errorrrr", error?.response?.data ?? error);
        return next(error?.response?.data ?? error)
    }
}

exports.checkTransaction = async (req, res, next) => {
    try {
        const result = await SPNGATEWAY.checkTransaction(req.body?.id);

        const payment_status = getStatusPayment(result?.status);

        await Payment.update({ payment_status }, { where: { transaction_id: result?.id } });

        return res.status(200).json({
            status: true,
            message: 'Success',
            data: result
        })
    } catch (error) {
        console.log("errorrrr", error?.response?.data ?? error);
        return next(error?.response?.data ?? error)
    }
}
 
exports.callBackSpnPay = async(req, res, next) => {
    try {
        console.log("Dataaaa callbackkkk.............", req.body);
        const newData = req.body;

        const payment_status = getStatusPayment(newData?.responseData?.status)

        await Payment.update({ payment_status }, { where: { transaction_id: newData?.responseData?.id } })
        return res.status(201).json({ status: true, message: 'success' })
    } catch (error) {
        return next(error)
    }
}
