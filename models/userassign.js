const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const userStorage = require('./adminmodel')
const assignuser =sequelize.define('userassign',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    maneger:{
        type: Sequelize.INTEGER,
        references: {
            model: 'userstorages',
        }},
    user:{
        type: Sequelize.INTEGER,
        references: {
            model: 'userstorages',
        }}

});
try {
    
    assignuser.sync({alter: true});
} catch (error) {
    console.log(error, 'llllllllllllllllllllllllll');
}
module.exports = assignuser