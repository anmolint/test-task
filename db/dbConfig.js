const sequelize = require("sequelize");
require("dotenv").config();

const db = new sequelize(process.env.dbname, process.env.dbuser, process.env.dbpassword, {
  host: "localhost",
  dialect: "mysql",
});
db.authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

const syncModel = async (Model) => {
  await Model.sync();
};

module.exports = { db, syncModel };
