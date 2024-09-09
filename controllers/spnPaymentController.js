const Agents = require("../models/agentModel");
const GamePackage = require("../models/gamePackageModel");
const RulePayment = require("../models/rulePaymentModel");
const User = require("../models/userModel");
const SPNGATEWAY = require("../services/spnpayGateway");
const { v4: uuidv4 } = require('uuid');
const { getCodeUtil } = require("../utils/getCodeUtil");
const Payment = require("../models/paymentModel");

exports.paymentTrx = async (req, res, next) => {
    try {

        console.log("bodyyyyy", req.body);
        

        const user = req?.user;

        const checkUser = await User.findOne({ where: { id: user?.id } });

        if (!checkUser) throw new Error('User not Found!');

        const getCodeName = getCodeUtil(req?.body?.payment_method, req?.body?.code);

        const data = {
            ...req.body,
            ...getCodeName,
            name: req.body?.name ?? checkUser?.username ?? "-",
            user_id_nero: user?.id,
            ref_id: req?.body?.ref_id ?? uuidv4(),
            transaction_id: uuidv4(),
            payment_status: 'Pending',
            fee_reff: 0,
        }

        // Get Fee
        const getFeeRule = await RulePayment.findOne({ where: { code: '001', is_active: true } });
        const fee = Math.floor((Number(data?.amount ?? 0) * Number(getFeeRule?.value ?? 0)) / 100);
        const priceWithFee = parseInt(Number(data?.amount ?? 0), 10) + fee;

        // check refferal agent
        const user_agent = await User.findOne({ where: { ref_id: data?.ref_id } });

        if (user_agent) {
            const getAgent = await Agents.findOne({ where: { id: user_agent?.agent_id } });

            if (getAgent) {
                data.fee_reff = Math.floor(( priceWithFee * getAgent?.fee ) / 100);
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

        
        const result = await SPNGATEWAY.createTrxPayment(data)
        
        data.merchant_id = data?.transaction_id;
        data.transaction_id = result?.id;
        data.rrn = result?.additionalInfo?.rrn ?? null;
        data.request_date = new Date()

        await Payment.create(data);
        
        console.log('dataaaa', data);
        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: {
                dto: data,
                result
            }
        })
    } catch (error) {
        return next(error)
    }
}

exports.callBackSpnPay = async(req, res, next) => {
    try {
        console.log("Dataaaa callbackkkk.............", req.body);
        return res.status(201).json({ status: true, message: 'success' })
    } catch (error) {
        return next(error)
    }
}

