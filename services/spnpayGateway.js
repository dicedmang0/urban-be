const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const { paymentMethodSpnpay } = require('../helpers/paymentMethodSpnpay');
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
        try {
            // const t = await sequelize.transaction();

            console.log('starttt....');
            
            
            const credential = this.credential()

            console.log('credential', credential);
            

            // get url payment method
            const paymentMethod = paymentMethodSpnpay(body?.payment_method);
            console.log('paymentMethod', paymentMethod);

            // create body and signature
            const bodyMethod = bodyMethodSpnpay(body)
            console.log('bodyMethod', bodyMethod);
            const signature = this.createSignature(bodyMethod);
            console.log('signature', signature);


            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${credential.SPNPAY_ENDPOINT}/${paymentMethod}`,
                headers: {
                    'On-Key': credential.PNPAY_SECRET_KEY,
                    'On-Token': credential.PNPAY_TOKEN,
                    'On-Signature': signature
                },
                data: bodyMethod
            };

            // const sendPay = await axios(config)


            // await Payment.create({

            // }, { transaction: t })

            // await t.commit();

            return config;
        } catch (error) {
            // await t.rollback()
            throw new Error(error); 
        } finally {}
    }

    static createSignature(body) {
        const credential = this.credential()
        console.log("dataaaaa", credential.PNPAY_TOKEN + JSON.stringify(body));


        return crypto.createHmac('sha512', credential.PNPAY_TOKEN).update(JSON.stringify(body)).digest('hex');
    }
}

module.exports = SPNGATEWAY;

// example encode SC-KRW9ESNZUUKQXOOX{"reference":"12345678","bankCode":"014","viewName":"Guntur Brahmaputra","type":"ClosedAmount","amount":10000,"additionalInfo":{"callback":"https:\/\/google.com"}}
