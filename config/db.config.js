require('dotenv').config();
module.exports = {
  HOST: process.env.DB_HOST || "34.101.250.7",
  PORT: process.env.DB_PORT ||"5432",
  USER: process.env.DB_USER ||"Urban-Admin",
  PASSWORD: process.env.DB_PASSWORD ||"Urbanadmin12",
  DB: process.env.DB_DBNAME ||"Urban"
};

// require('dotenv').config();
// module.exports = {
//   HOST: process.env.DB_HOST || "localhost",
//   PORT: process.env.DB_PORT || "5432",
//   USER: process.env.DB_USER ||"postgres",
//   PASSWORD: process.env.DB_PASSWORD || "admin",
//   DB: process.env.DB_DBNAME || "geco"
// };

// require('dotenv').config();
// module.exports = {
//   HOST: process.env.DB_HOST || "localhost",
//   PORT: process.env.DB_PORT || "5432",
//   USER: process.env.DB_USER ||"user",
//   PASSWORD: process.env.DB_PASSWORD || "wkwkwk",
//   DB: process.env.DB_DBNAME || "mydb"
// };
