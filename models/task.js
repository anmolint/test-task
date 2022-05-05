const { db, syncModel } = require("../db/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");
const Task = db.define("task", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  managerId: {
    type: Sequelize.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  description: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.ENUM,
    values: ["open", "ready", "in-review", "completed"],
  },
  rating:{type:Sequelize.STRING}
});

syncModel(Task);

module.exports = Task;
