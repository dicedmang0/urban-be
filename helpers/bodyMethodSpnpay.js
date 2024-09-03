const { v4: uuidv4 } = require('uuid');

exports.bodyMethodSpnpay = (body) => {
    switch(body?.payment_method?.toLowerCase()) {
        case 'e-wallet':
            return {
                reference: body?.ref_id ?? uuidv4(),
                phoneNumber:"082195395779",
                channel:"ovo",
                amount: 10000,
                expiryMinutes: 30,
                viewName: "Mr. Gentur",
                additionalInfo: {
                    callback: "https://api.nerogames.id/api/callback-spnpay",
                }
            }
        case 'virtual account':
            return {

            }
        case 'qris':
            return {}
        case 'credit card':
            return {}
        default:
            return {}
    }
}