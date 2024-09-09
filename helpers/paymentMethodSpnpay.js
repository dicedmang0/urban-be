exports.urlPathSpnpay = (url) => {
    switch(url?.toLowerCase()) {
        case 'e-wallet':
            return 'e-wallet'
        case 'virtual account':
            return 'virtual-account'
        case 'qris':
            return 'qris'
        case 'credit card':
            return 'credit-card'
        default:
            return ''
    }
}