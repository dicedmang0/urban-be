const sequelize = require("./database");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const initDb = async () => {
  try {
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 8);

    await sequelize.sync({ force: false }); // This will drop the table if it already exists and create a new one
    // console.log("Database & tables created!");

    const user = await User.findOne({ where: { username: "SUPERADMIN" } });

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
