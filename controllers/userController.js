// controllers/userController.js
const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(201).json({data: users});
  } catch (error) {
    res.status(500).send({message: error.message});
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ name,  password: hashedPassword });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
};
