const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const assigntask =sequelize.define('taskassign',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    manegerid:{type: Sequelize.INTEGER},
    userid:{type: Sequelize.INTEGER}
});
assigntask.sync({force:true})
module.exports = assigntask