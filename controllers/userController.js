// controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.getUsersAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { id, limit, offset } = req.query;

    let queryOptions = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      where: {},
    };

    if (id) {
      queryOptions.where.id = id;
    }

    const users = await User.findAll(queryOptions);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { username, password, role, email, is_active } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      username,
      password: hashedPassword,
      role: role,
      email: email,
      is_active: is_active,
    });

    res.status(200).json({ status: "Success", message: "Success Add User" });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password, id, role, email, is_active } = req.body;

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res
        .status(400)
        .send({ status: "Bad Request", message: "User Not Found!" });
    }

    let dtoUpdateUser = {
      username,
      role: role,
      email: email,
      is_active: is_active,
    };

    if (user.password != password) {
      const hashedPassword = await bcrypt.hash(password, 8);
      if (hashedPassword != user.password) {
        dtoUpdateUser = {
          ...dtoUpdateUser,
          password: hashedPassword,
        };
      }
    }

    await User.update(dtoUpdateUser, { where: { id: id } });

    res
      .status(200)
      .json({ status: "Success", message: "Success Update User!" });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    await User.update(
      { is_active: 0 },
      {
        where: {
          id: idUser,
        },
      }
    );

    res
      .status(200)
      .json({ status: "Success", message: "Success Remove User!" });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};
