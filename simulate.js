const paymentController = require('./controllers/paymentController'); // Adjust the path as needed

// Call simulatePayment directly
paymentController.simulatePayment()
  .then(() => {
    console.log('Simulation completed successfully.');
    process.exit(0); // Exit the process when done
  })
  .catch((error) => {
    console.error('Error in simulatePayment:', error.message);
    process.exit(1); // Exit with error status
  });
