// controllers/userController.js
const Agents = require("../models/agentModel");
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

    // Count total items without limit and offset
    const totalCount = await User.count({
      where: queryOptions.where,
    });

    res.status(200).json({ users, totalCount });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.updateProfileUser = async (req, res) => {
  try {
    const { password, id, email } = req.body;

    const user = await User.findOne({ where: { id: id } });
    let dtoUpdateUser = {
      // email: email,
    };

    if (!user) {
      return res
        .status(400)
        .send({ status: "Bad Request", message: "User Not Found!" });
    }

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
      .json({ status: "Success", message: "Success Update Profile User!" });

  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
}

exports.addUser = async (req, res) => {
  try {
    const { username, password, ref_id, role, nik, email, is_active, agent_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    
    // if(!agent){
      //   throw {message: "Agent is Not Found!"};
      // }
    let agent = null
    let dtoCreateUser = {
      username,
      role: role,
      nik: nik,
      ref_id: ref_id,
      // email: email,
      // agent_id: agent.id,
      is_active: is_active,
    };
    
    if(role == 'agent') {
      agent = await Agents.findByPk(agent_id);
      
      if(!agent){
        throw {message: "Agent is Not Found!"};
      }
      dtoCreateUser = {
        ...dtoCreateUser,
        agent_id: agent.id
      }
    }

    let isAgentNull = agent ? agent.id : null;

    await User.create({
      username,
      password: hashedPassword,
      role: role,
      nik: nik,
      ref_id: ref_id,
      // email: email,
      agent_id: isAgentNull,
      is_active: is_active,
    });

    res.status(200).json({ status: "Success", message: "Success Add User" });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, ref_id, nik, password, id, role, email, is_active, agent_id } = req.body;

    const user = await User.findOne({ where: { id: id } });
    let agent = null
    let dtoUpdateUser = {
      username,
      role: role,
      nik: nik,
      ref_id: ref_id,
      // email: email,
      // agent_id: agent.id,
      is_active: is_active,
    };

    if(role == 'agent') {
      agent = await Agents.findByPk(agent_id);
      
      if(!agent){
        throw {message: "Agent is Not Found!"};
      }
      dtoUpdateUser = {
        ...dtoUpdateUser,
        agent_id: agent.id
      }
    }
    
    if (!user) {
      return res
        .status(400)
        .send({ status: "Bad Request", message: "User Not Found!" });
    }

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
