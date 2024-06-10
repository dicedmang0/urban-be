const sequelize = require("./database");
const User = require("../models/userModel");
const PaymentMethod = require("../models/paymentMethodModel");
const PaymentMethodDetail = require("../models/paymentMethodDetailModel");
const bcrypt = require("bcryptjs");
const fundList = require("./initialPayment");

const initDb = async () => {
  try {
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 8);

    await sequelize.sync({ force: false }); // This will drop the table if it already exists and create a new one
    // console.log("Database & tables created!");

    const user = await User.findOne({ where: { username: "SUPERADMIN" } });

    const paymentMethod = await PaymentMethod.count();
    const paymentMethodDetail = await PaymentMethodDetail.count();

    console.log(paymentMethod, paymentMethodDetail,'????')

    if (paymentMethod === 0 && paymentMethodDetail === 0) {
      fundList.forEach(async (val, index) => {
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

    if (!user) {
      await User.create({
        username: "SUPERADMIN",
        ref_id: "-",
        password: hashedPassword,
        email: "-",
        role: "Superadmin",
        is_active: 1,
      });
      // console.log("Initial users created!");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

module.exports = initDb;
