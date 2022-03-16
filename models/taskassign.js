const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const assigntask =sequelize.define('taskassign',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    taskid:{
        type: Sequelize.INTEGER,
        references: {
            model: 'tasks',
            key: 'id',
        }},
    manegerid:{
        type: Sequelize.INTEGER,
        references: {
            model: 'userstorages',
            key: 'id',
        }
    },
    userid:{
        type: Sequelize.INTEGER,
        references: {
            model: 'userstorages',
            key: 'id',
        }
    },
   
});
assigntask.sync()
module.exports = assigntask