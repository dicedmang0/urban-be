// require('dotenv').config();
// module.exports = {
//   HOST: process.env.DB_HOST || "34.124.207.224",
//   PORT: process.env.DB_PORT ||"5432",
//   USER: process.env.DB_USER ||"Nero-Admin",
//   PASSWORD: process.env.DB_PASSWORD ||"Neroadmin12",
//   DB: process.env.DB_DBNAME ||"Nero"
// };

require('dotenv').config();
module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  PORT: process.env.DB_PORT || "5432",
  USER: process.env.DB_USER ||"postgres",
  PASSWORD: process.env.DB_PASSWORD || "admin",
  DB: process.env.DB_DBNAME || "geco"
};
