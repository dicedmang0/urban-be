require('dotenv').config();
module.exports = {
  HOST: process.env.DB_HOST || "34.124.207.224",
  PORT: process.env.DB_PORT ||"5432",
  USER: process.env.DB_USER ||"Nero-Admin",
  PASSWORD: process.env.DB_PASSWORD ||"Neroadmin12",
  DB: process.env.DB_DBNAME ||"Nero"
};

// require('dotenv').config();
// module.exports = {
//   HOST: process.env.DB_HOST || "localhost",
//   PORT: process.env.DB_PORT ||"5432",
//   USER: process.env.DB_USER ||"user",
//   PASSWORD: process.env.DB_PASSWORD ||"wkwkwk",
//   DB: process.env.DB_DBNAME ||"mydb"
// };
