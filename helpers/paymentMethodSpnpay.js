exports.paymentMethodSpnpay = (url) => {
    switch(url) {
        case 'E-Wallet':
            return 'e-wallet'
        case 'Virtual Account':
            return 'virtual-account'
        case 'Qris':
            return 'qris'
        case 'Credit Card':
            return 'credit-card'
        default:
            return ''
    }
}