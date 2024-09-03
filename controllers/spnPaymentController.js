const SPNGATEWAY = require("../services/spnpayGateway");

exports.getCredential = async (req, res, next) => {
    try {

        const user = req?.user;

        const data = {
            user_id: user?.id,
            ...req.body
        }

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

