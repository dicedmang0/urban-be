// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DB, HOST, PORT, USER, PASSWORD, } = require('./db.config');

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: 'postgres',
});

module.exports = sequelize;
