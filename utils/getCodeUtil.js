const { arrayFund } = require("../config/initialPayment")

exports.getCodeUtil = (payment_method, code) => {
    const getPaymentMethod = arrayFund.find((val) => val.name === payment_method);
    const getCodeName = getPaymentMethod?.child?.find(val => val.code === code);

    return { payment_method, code: getCodeName?.code, code_name: getCodeName.name }
}