// tests/__mocks__/sequelize.js
const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();

const UserMock = dbMock.define("User", {
  id: 1,
  name: "John Doe",
});

const CoinMock = dbMock.define("Coin", {
  id: 1,
  amount: "1000",
});

module.exports = {
  sequelize: dbMock,
  User: UserMock,
  Coin: CoinMock,
};
