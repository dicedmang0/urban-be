const { v4: uuidv4 } = require('uuid');

exports.bodyMethodSpnpay = (body) => {
    const expiryTime = 30;
    const callback_url = process.env.CALLBACK_SPNPAY;

    switch(body?.payment_method?.toLowerCase()) {
        case 'e-wallet':
            return {
                reference: uuidv4(),
                phoneNumber: body?.phone_number,
                channel: body?.code,
                amount: body.amount,
                expiryMinutes: expiryTime,
                viewName: body?.name,
                additionalInfo: {
                    callback: callback_url,
                }
            }
        case 'virtual account':
            return {
                bankCode: body?.code,
                singleUse: true,
                type: "ClosedAmount",
                reference: uuidv4(),
                amount: body.amount,
                expiryMinutes: expiryTime,
                viewName: body?.name,
                additionalInfo: {
                    callback: callback_url
                }
            }            
        case 'qris':
            return {
                reference: uuidv4(),
                amount: body?.amount,
                expiryMinutes: expiryTime,
                viewName: body?.name,
                additionalInfo: {
                    callback: callback_url
                }
            }
            
        case 'credit card':
            return {
                reference: uuidv4(),
                phoneNumber: body?.phone_number,
                amount: body?.amount,
                expiryMinutes: expiryTime,
                viewName: body?.name,
                additionalInfo: {
                    callback: callback_url
                }
            }
            
        default:
            return {}
    }
}