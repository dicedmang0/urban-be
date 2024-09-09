const { arrayFund } = require("../config/initialPayment")

exports.getCodeUtil = (payment_method, code) => {
    const getPaymentMethod = arrayFund.find((val) => val?.name?.toLowerCase() === payment_method?.toLowerCase());
    const getCodeName = getPaymentMethod?.child?.find(val => val.code === code) ?? {};
    
    // If payment method is Qris
    if (payment_method?.toLowerCase() === 'qris') {
        getCodeName.name = 'Qris',
        code = 'qris'
    };

    // If payment method is Credit Card
    if (payment_method?.toLowerCase() === 'credit card') {
        getCodeName.name = 'Credit Card',
        code = 'credit-card'
    };

    return { payment_method, code, code_name: getCodeName?.name }
}