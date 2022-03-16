const sequelize = require("../db/network");
const { Sequelize } = require("sequelize");
const userStorage = sequelize.define("userstorage", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: { type: Sequelize.STRING, unique: true },
  password: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING, unique: true },
  role: { type: Sequelize.STRING },
  firstname: { type: Sequelize.STRING },
  lastname: { type: Sequelize.STRING },
  phonenumber: { type: Sequelize.INTEGER },
  address: { type: Sequelize.STRING },
});
userStorage.sync();
module.exports = userStorage;
