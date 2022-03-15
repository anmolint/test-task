const dbops = require('../models/index')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const login = async (req, res) => {
    try {
        let user = await dbops.admindata.findOne({
            where: { username: req.body.username }
        });
        if (user.role == 'maneger') {
            let decryption = await bcrypt.compare(req.body.password, user.password);
            if (decryption == true) {
                let token = jwt.sign({ user_id: user.id }, "abcd", {
                    expiresIn: "1h",
                });
                res.send(token);
            }
        } else {
            res.send("invalid login ");
        }

    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }
}
const createtask = async (req, res) => {
    try {
        let uid = req.user
        let taskcreate = await dbops.taskcreate.create({
            task: req.body.task,
            status: req.body.status
        })
        res.send('task created')
    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }
}
const updateTask = async(req,res) =>{
    try {
        let uid = req.user
        let taskcreate = await dbops.taskcreate.update({where:{
            task: req.body.task,
            status: req.body.status
        }})
        res.send('task created')
    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }
}
const assigntask = async(req,res) =>{
    try
    { let mid =req.user

    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }
}
module.exports = { login, createtask,assigntask,updateTask }