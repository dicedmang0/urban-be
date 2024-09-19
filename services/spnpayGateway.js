const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const { urlPathSpnpay } = require('../helpers/paymentMethodSpnpay');
const sequelize = require('../config/database');
const { default: axios } = require('axios');
const { bodyMethodSpnpay } = require('../helpers/bodyMethodSpnpay');

class SPNGATEWAY {
    static credential() {
        return {
            SPNPAY_ENDPOINT: process.env.SPNPAY_ENDPOINT,
            PNPAY_SECRET_KEY: process.env.SPNPAY_SECRET_KEY,
            PNPAY_TOKEN: process.env.PNPAY_TOKEN,
        }
    }

    static async createTrxPayment(body) {
        const credential = this.credential()

        // get url payment method
        const getPathUrl = urlPathSpnpay(body?.payment_method);

        // create body spnpay and signature
        const bodyMethod = bodyMethodSpnpay(body)
        const signature = this.createSignatureBody(bodyMethod);

        const config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: `${credential.SPNPAY_ENDPOINT}/${getPathUrl}`,
            headers: {
                'On-Key': credential.PNPAY_SECRET_KEY,
                'On-Token': credential.PNPAY_TOKEN,
                'On-Signature': signature
            },
            data: bodyMethod
        };

        const sendPay = await axios(config);

        const resultSpnPay = await sendPay?.data?.responseData;

        return resultSpnPay;
    }

    static async checkTransaction(id) {
        const credential = this.credential();
        const signature = this.generateSignatureToken();

        const config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `${credential.SPNPAY_ENDPOINT}/check/${id}`,
            headers: {
                'On-Key': credential.PNPAY_SECRET_KEY,
                'On-Token': credential.PNPAY_TOKEN,
                'On-Signature': signature
            },
        };

        const sendPay = await axios(config);

        const resultSpnPay = await sendPay?.data?.responseData;

        return resultSpnPay;
    }

    static createSignatureBody(body) {
        const credential = this.credential();
        const key = credential.PNPAY_SECRET_KEY;
        const token = credential.PNPAY_TOKEN;

        const dataToSign = key + JSON.stringify(body).replace(/\//g, '\\/');

        return crypto.createHmac('sha512', token).update(dataToSign).digest('hex');
    }

    static generateSignatureToken() {
        const credential = this.credential();
        const key = credential.PNPAY_SECRET_KEY;
        const token = credential.PNPAY_TOKEN;

        return crypto.createHmac('sha512', token)
            .update(key)
            .digest('hex');
    }
}

module.exports = SPNGATEWAY;

// example encode SC-KRW9ESNZUUKQXOOX{"reference":"12345678","bankCode":"014","viewName":"Guntur Brahmaputra","type":"ClosedAmount","amount":10000,"additionalInfo":{"callback":"https:\/\/google.com"}}

// example response
// {
//     "responseCode": 200,
//     "responseMessage": "success",
//     "responseData": {
//         "id": "cef6ebc5-3ab4-4176-9e90-432280d33cbb",
//         "merchantRef": "asdsad",
//         "status": "pending",
//         "feePayer": "merchant",
//         "amount": 10000,
//         "fee": 5000,
//         "totalAmount": 10000,
//         "expiredDate": "2024-09-07T15:04:28+07:00",
//         "paidDate": null,
//         "settleDate": "2024-09-07T14:34:28+07:00",
//         "additionalInfo": {
//             "callback": "http://your-site-callback.com/notify"
//         },
//         "virtualAccount": {
//             "bankCode": "014",
//             "vaNumber": "821881029905",
//             "viewName": "Mr. Gentur"
//         }
//     }
// }