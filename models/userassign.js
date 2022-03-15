const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const assignuser =sequelize.define('userassign',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    maneger:{type: Sequelize.INTEGER},
    user:{type: Sequelize.INTEGER}

});
assignuser.sync();
module.exports = assignuser