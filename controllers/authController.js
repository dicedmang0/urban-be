const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { uniqueNamesGenerator, NumberDictionary, adjectives, colors, names } = require('unique-names-generator');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY_APPLICATION, {
      expiresIn: '1h',
    });

    res.status(200).json({ auth: true, token });
  } catch (error) {
    res.status(500).send('Error on the server.');
  }
};

exports.register = async (req, res) => {
  try {
    
    let idUser = req.body.USERID;
    const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
    const configNames = {
        dictionaries: [adjectives, names, numberDictionary]
    }
    
    const randomNames = uniqueNamesGenerator(configNames);
    const defaultPassword = process.env.DEFAULT_PASSWORD;

    const { username } = req.body;
    const isUserAvailable = await User.findOne({ where: { username } });
    idUser = isUserAvailable?.id;

    // return console.log(isUserAvailable,'???')
    if (!isUserAvailable) {
        const hashedPassword = await bcrypt.hash(defaultPassword, 8);
        const user = await User.create({ username: randomNames, password: hashedPassword, role: 'User', email: "-", is_active: 1 });
        idUser = user.id;
    }

    const token = jwt.sign({ id: idUser }, process.env.SECRET_KEY_APPLICATION, {
      expiresIn: '1h',
    });

    await User.update({ token: token }, { where: { id: idUser } });

    res.status(201).json({ auth: true, token, user_id: idUser });
  } catch (error) {
    console.log(error,'??')
    res.status(500).send('Error registering the user.');
  }
};
