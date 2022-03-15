const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const task = sequelize.define('task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // manegerid: {
    //     type: Sequelize.INTEGER,
    //     references: {
    //         model: 'userassign',
    //         key: 'maneger',
    //     }
    // },
    task: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING }
}
);
task.sync({ force: true });
module.exports = task;