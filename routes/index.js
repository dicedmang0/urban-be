const { swaggerUi, specs } = require('../swagger/swagger');
const userRoutes = require('./users/userRoutes');
const usersRoutes = require('./users/user.route');
const coinRoutes = require('./coinRoutes');
const paymentRoutes = require('./paymentRoutes');
const paymentMethodRoutes = require('./paymentMethodRoutes');
const gameRoutes = require('./gameRoutes');
const agentRoutes = require("./agentRoutes");
const recoveryQuestionsRoutes = require("./recoveryQuestionsRoutes");
const rulePaymentRoutes = require("./rulePaymentRoutes");
const gamePackageRoutes = require("./gamePackageRoutes");
const spnpayRoute = require("./transactions/spnpayRoute");
const dashboardAdmin = require("./admins/dashboardAdminRoute");
const transactionRoute = require("./transactions/transactionRoute");
const { verifyToken } = require('../middlewares/authJwt');

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use('/api', userRoutes);
    app.use('/api', coinRoutes);
    app.use('/api', paymentRoutes);
    app.use('/api', paymentMethodRoutes);
    app.use('/api', gameRoutes);
    app.use("/api", agentRoutes);
    app.use("/api", recoveryQuestionsRoutes);
    app.use("/api", gamePackageRoutes);
    app.use("/api", rulePaymentRoutes);
    app.use('/api', spnpayRoute)
    app.use('/api', dashboardAdmin)
    app.use('/api', transactionRoute)

    // Update
    app.use('/api', usersRoutes)
}