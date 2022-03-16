const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const assignuser =sequelize.define('userassign',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    maneger:{
        type: Sequelize.INTEGER,
        unique: true,
        references: {
            model: 'userstorages',
            key: 'id',
        }},
    user:{
        type: Sequelize.INTEGER,
        unique: true,
        references: {
            model: 'userstorages',
            key: 'id',
        }}

});
assignuser.sync();
module.exports = assignuser