require('dotenv').config();
module.exports = {
  HOST: process.env.MYSQL_HOST || "host.docker.internal",
  PORT: process.env.MYSQL_PORT || "3306",
  USER: process.env.MYSQL_USER ||"root",
  PASSWORD: process.env.MYSQL_PASSWORD || "root",
  DB: process.env.MYSQL_DBNAME || "argon"
};