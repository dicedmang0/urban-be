const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  colors,
  names
} = require('unique-names-generator');
const RecoveryQuestion = require('../models/recoveryQuestionModel');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'User Not Found' });
    }

    if (!user.is_active) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'User Is Not Active' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Invalid Password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY_APPLICATION,
      {
        expiresIn: process.env.EXPIRED_TIME
      }
    );

    await User.update({ token: token }, { where: { id: user.id } });

    res
      .status(200)
      .json({ auth: true, token, role: user.role, user_id: user.id });
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    let idUser = '';
    let role = '';
    const defaultPassword = process.env.DEFAULT_PASSWORD;

    const { username, email, password, recovery_question, recovery_answer } =
      req.body;
    const isUserAvailable = await User.findOne({ where: { username } });
    idUser = isUserAvailable?.id;
    role = isUserAvailable?.role;

    if (!isUserAvailable) {
      const hashedPassword = await bcrypt.hash(password, 8);
      // const hashedPassword = await bcrypt.hash(defaultPassword, 8);
      const user = await User.create({
        username: username,
        password: hashedPassword,
        role: 'user',
        // email: email,
        recovery_question: recovery_question,
        recovery_answer: recovery_answer,
        is_active: 1
      });
      idUser = user.id;
      role = user.role;
    } else {
      throw { message: 'This User Already Registered.' };
    }

    const token = jwt.sign(
      { id: idUser, role: role },
      process.env.SECRET_KEY_APPLICATION,
      {
        expiresIn: process.env.EXPIRED_TIME
      }
    );

    await User.update({ token: token }, { where: { id: idUser } });

    res.status(200).json({ auth: true, token, role: role });
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};

exports.registerRandomUser = async (req, res) => {
  try {
    let idUser = '';
    let role = '';
    const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
    const configNames = {
      dictionaries: [adjectives, names, numberDictionary]
    };

    const randomNames = uniqueNamesGenerator(configNames);
    const defaultPassword = process.env.DEFAULT_PASSWORD;

    const { username, ref_id } = req.body;
    const isUserAvailable = await User.findOne({ where: { username } });
    idUser = isUserAvailable?.id;
    role = isUserAvailable?.role;

    if (!isUserAvailable) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 8);
      const user = await User.create({
        username: username ? username : randomNames,
        password: hashedPassword,
        role: 'user',
        // email: '-',
        ref_id: ref_id || null,
        is_active: 1
      });
      idUser = user.id;
      role = user.role;
    }

    const token = jwt.sign({ id: idUser }, process.env.SECRET_KEY_APPLICATION, {
      expiresIn: process.env.EXPIRED_TIME
    });

    await User.update({ token: token }, { where: { id: idUser } });

    res.status(200).json({ auth: true, token, role: role });
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};

exports.checkUserCheck = async (req, res) => {
  try {
    const { username, recovery_question, recovery_answer } = req.body;
    const isUserAvailable = await User.findOne({ where: { username } });

    if (!isUserAvailable) {
      throw { message: "Username Not Found."}  
    } 

    const question = await RecoveryQuestion.findOne({where: {id: isUserAvailable.recovery_question}});
    
    res.status(200).json({ isUserAvailable: true, id_question: question.id, question: question.text });
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};


exports.checkAnswerUser = async (req, res) => {
  try {
    const { username, recovery_question, recovery_answer } = req.body;
    const isUserAvailable = await User.findOne({ where: { username } });
    const isValidQuestions = await RecoveryQuestion.findOne({where: {id: recovery_question} })

    if(!isValidQuestions) {
      throw { message: "Wrong Questions."}
    }

    let isValidToChange = false;
    if (isUserAvailable) {
      if (
        recovery_question == isUserAvailable.recovery_question &&
        recovery_answer == isUserAvailable.recovery_answer
      ) {
        isValidToChange = true;
      }
    } else {
      throw { message: "Username Not Found."}
    }

    if (!isValidToChange) {
      throw { message: 'Wrong Answer.' };
    }

    res.status(200).json({ isValidToChange: isValidToChange });
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};

exports.changePasswordRecovery = async (req, res) => {
  try {
    const { username, recovery_question, recovery_answer, password } = req.body;
    const isUserAvailable = await User.findOne({ where: { username } });

    const isValidQuestions = await RecoveryQuestion.findOne({where: {id: recovery_question} })

    if(!isValidQuestions) {
      throw { message: "Wrong Questions."}
    }

    let isValidToChange = false;
    if (isUserAvailable) {
      if (
        recovery_question === isUserAvailable.recovery_question &&
        recovery_answer === isUserAvailable.recovery_answer
      ) {
        isValidToChange = true;
      }
    }else {
      throw { message: "Username Not Found."}
    }


    if (!isValidToChange) {
      throw { message: 'Wrong Answer.' };
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    await User.update(
      { password: hashedPassword },
      { where: { username: username } }
    );

    res.status(200).json({ status: 'Success', message: 'Success Update Password. You Can Login now with current password.' });
  } catch (error) {
    res.status(500).send({ status: 'Bad Request', message: error.message });
  }
};
