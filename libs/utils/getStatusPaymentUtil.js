exports.getStatusPayment = (status) => {
    switch(status) {
        case 'success': return "Success";
        case 'pending': return "Pending";
        case 'failed': return "Failed"
    }
}