const Agents = require("../models/agentModel");
const RulePayment = require("../models/rulePaymentModel");
const User = require("../models/userModel");
const SPNGATEWAY = require("../services/spnpayGateway");
const { v4: uuidv4 } = require('uuid');

exports.getCredential = async (req, res, next) => {
    try {

        const user = req?.user;

        const data = {
            ...req.body,
            user_id_nero: user?.id,
            ref_id: req?.body?.ref_id ?? uuidv4(),
            transaction_id: req?.body?.transaction_id ?? uuidv4(),
            payment_status: 'Pending',
            fee_reff: 0
        }

        // Get Fee
        const getFeeRule = await RulePayment.findOne({ where: { code: '001', is_active: true } });
        const fee = Math.floor((Number(data?.amount ?? 0) * Number(getFeeRule?.value ?? 0)) / 100);
        const priceWithFee = parseInt(Number(data?.amount ?? 0), 10) + fee;

        // check refferal agent
        const user_agent = await User.findOne({ where: { ref_id: body?.ref_id } });

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

        if (!isGameHasToCheck) throw new Error({ message: 'Your Game is not available!' });
        

        const result = await SPNGATEWAY.createTrxPayment(data)

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: result
        })
    } catch (error) {
        return next(error)
    }
}

exports.callBackSpnPay = async(req, res, next) => {
    try {
        console.log("Dataaaa callbackkkk.............", req.body)
    } catch (error) {
        return next(error)
    }
}

