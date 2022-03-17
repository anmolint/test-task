const sequelize = require("../db/network");
const { Sequelize } = require("sequelize");
const assignuser = require("./userassign");
const task = require("./tasks");
const assignTask = require("./taskassign");
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
userStorage.associate = function (models) {
  models.userStorage.hasMany(models.userStorage, {
    through: models.assignuser,
    as: "users",
    foreignKey: "user",
  });
  models.userStorage.belongsTo(models.userStorage, {
    through: models.assignuser,
    as: "manegers",
    foreignKey: "maneger",
  });
};
userStorage.sync({ alter: true });
module.exports = userStorage;
