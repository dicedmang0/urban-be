const { statusTransaction } = require("../consts/typeTransaction");

exports.getStatusTrx = (status) => {
    switch(status) {
        case 'success': return statusTransaction.SUCCESS;
        case 'pending': return statusTransaction.PENDING;
        case 'failed': return statusTransaction.FAILED;
    }
}
