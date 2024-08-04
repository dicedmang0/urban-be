const sequelize = require("./database");
const User = require("../models/userModel");
const PaymentMethod = require("../models/paymentMethodModel");
const PaymentMethodDetail = require("../models/paymentMethodDetailModel");
const Agent = require("../models/agentModel");
const bcrypt = require("bcryptjs");
const {arrayFund, arrayRecoveryQuestions, arrayGamePackages} = require("./initialPayment");
const RecoveryQuestion = require("../models/recoveryQuestionModel");
const GamePackage = require("../models/gamePackageModel");
const RulePayment = require("../models/rulePaymentModel");

const initDb = async () => {
  try {
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 8);

    await sequelize.sync({ force: false }); // This will drop the table if it already exists and create a new one

    const user = await User.findOne({ where: { username: "SUPERADMIN" } });
    const agentList = await Agent.count();

    const paymentMethod = await PaymentMethod.count();
    const paymentMethodDetail = await PaymentMethodDetail.count();

    const recoveryQuestions = await RecoveryQuestion.count();

    const gamePackages = await GamePackage.count();

    const rules = await RulePayment.count();
    
    if(rules === 0) {
      await RulePayment.create({
        code: '001',
        description: 'Payment Margin Fee in percentages',
        value: '5',
        is_active: 1
    });
    }

    if(gamePackages === 0) {
      arrayGamePackages.forEach(async (val, index) => {
        await GamePackage.create({
            name: val.name,
            title: val.title,
            image: val.image,
            description: val.description,
            check_username: val.check_username,
            use_uniplay: val.use_uniplay,
            use_retail: val.use_retail,
            use_credit_card: val.use_credit_card,
            use_ewallet: val.use_ewallet,
            use_virtual_account: val.use_virtual_account,
            use_qris: val.use_qris,
            is_active: val.is_active
        });
    });
    
    }

    if(recoveryQuestions === 0) {
      arrayRecoveryQuestions.forEach(async (val, index) => {
        const paymentMethod = await RecoveryQuestion.create({
          text: val.text,
          is_active: val.is_active,
        });
      });
    }

    if (paymentMethod === 0 && paymentMethodDetail === 0) {
      arrayFund.forEach(async (val, index) => {
        const paymentMethod = await PaymentMethod.create({
          name: val.name,
          is_active: 1,
        });

        const hasChild = val.child.length > 0;

        if (hasChild) {
          val.child.forEach(async (chld, idx) => {
            await PaymentMethodDetail.create({
              code: chld.code,
              name: chld.name,
              paymentMethodId: paymentMethod.id,
              is_active: 1,
            });
          });
        }
      });
    }

    if(!agentList) {
      const agent = await Agent.create({name: 'AMP', is_active: 1});
    }

    if (!user) {
      await User.create({
        username: "SUPERADMIN",
        ref_id: "-",
        password: hashedPassword,
        // email: "-",
        agent_id: null,
        role: "superadmin",
        is_active: 1,
      });
      // console.log("Initial users created!");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

module.exports = initDb;
