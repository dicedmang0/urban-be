const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  colors,
  names,
} = require("unique-names-generator");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res
        .status(400)
        .send({ status: "Bad Request", message: "User Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ status: "Bad Request", message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY_APPLICATION,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ auth: true, token, role: user.role });
  } catch (error) {
    res.status(500).send({ status: "Bad Request", message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    let idUser = req.body.USERID;
    let role = "";
    const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
    const configNames = {
      dictionaries: [adjectives, names, numberDictionary],
    };

    const randomNames = uniqueNamesGenerator(configNames);
    const defaultPassword = process.env.DEFAULT_PASSWORD;

    const { username } = req.body;
    const isUserAvailable = await User.findOne({ where: { username } });
    idUser = isUserAvailable?.id;
    idUser = isUserAvailable?.role;

    if (!isUserAvailable) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 8);
      const user = await User.create({
        username: randomNames,
        password: hashedPassword,
        role: "User",
        email: "-",
        is_active: 1,
      });
      idUser = user.id;
      role = user.role;
    }

    const token = jwt.sign({ id: idUser }, process.env.SECRET_KEY_APPLICATION, {
      expiresIn: "1h",
    });

    await User.update({ token: token }, { where: { id: idUser } });

    res.status(200).json({ auth: true, token, role: user.role });
  } catch (error) {
    res.status(500).send({ status: "Bad Request", message: error.message });
  }
};
