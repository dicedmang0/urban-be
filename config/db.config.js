require('dotenv').config();
module.exports = {
  HOST: process.env.DB_HOST || "host.docker.internal",
  PORT: process.env.DB_PORT || "3306",
  USER: process.env.DB_USER ||"postgres",
  PASSWORD: process.env.DB_PASSWORD || "root",
  DB: process.env.DB_DBNAME || "geco"
};