const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const task = sequelize.define('task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    manegerid: {
        type: Sequelize.INTEGER,
        references: {
            model: 'userstorages',
            key: 'id',
        }
    },
    task: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING }
}
);
task.sync();
module.exports = task;