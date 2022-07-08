const dbops = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { validationResult }
    = require('express-validator');
const register = async (req, res) => {
  try {
    const data = validationResult(req)
    if (!data.isEmpty()) {
        res.status(400).send(data)
    }
    if(req.body.password!==req.body.confpass){
      res.status(400).json("passwords and confpass do not match")
    }

    let saltRounds = await bcrypt.genSalt(10);
    let encrypt = await bcrypt.hashSync(req.body.password, saltRounds);
    let admindatacreate = await dbops.admindata.create({
      username: req.body.username,
      password: encrypt,
      email: req.body.email,
      role: "user",
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phonenumber: req.body.phonenumber,
      address: req.body.address,
    });
    let token = jwt.sign({ user_id: admindatacreate.id }, process.env.key, {
      expiresIn: "1h",
    });
   res.status(200).json(token);
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
};
const login = async (req, res) => {
  try {
    const data = validationResult(req)
    if (!data.isEmpty()) {
        res.status(400).send(data)
    }
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    if (user) {

      let decryption = await bcrypt.compare(req.body.password, user.password);
      if (decryption == true) {
        let token = jwt.sign({ user_id: user.id }, process.env.key, {
          expiresIn: "1h",
        });
       res.status(200).json(token);
      }
      else {
        res.status(400).json("Invalid Password");
       }
    }
    else{res.status(400).json("username does not exist")}
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
};
const readtasks = async (req, res) => {
  try {
    let uid = req.user;
    let tasks = await dbops.admindata.findAll({
      include: ["tasks"],
      where: { id: uid.user_id },
      through: { attributes: [] },
    });
   res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
};
const updateTaskStatus = async (req, res) => {
  try 
  {
    const data = validationResult(req)
    if (!data.isEmpty()) {
        res.status(400).send(data)
    }
    let uid = req.user;
    let tid = req.body.taskId;
    let task =await dbops.taskcreate.findOne({where:{id:tid}})
    let assginee = await dbops.taskassgin.findOne({where:{userId:uid.user_id}})
     if(task){
       if(assginee.userId===uid.user_id){
    await dbops.taskcreate.update(
      { status: req.body.status },
      { where: { id: tid } }
    );
   res.status(200).json("status updated");
  }else{
    res.send(400).json('you are not assigned this task')
  }
  }
   else{res.status(400).json("task does not exist")}
  } catch (error) {
    console.log(error);
   res.status(400).json("You cannot update task you are not assigned")
  }
};
const changePassword = async (req, res) => {
  try {
    const data = validationResult(req)
    if (!data.isEmpty()) {
       res.status(400).json(data)
    }
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!0",user);
    if (!user) {
      res.status(400).json("invalid username");
    }
     else
      {
      if(user.role==="user")
      {
      let saltRounds = await bcrypt.genSalt(10);
      let passwordNew = await bcrypt.hashSync(req.body.newpassword, saltRounds);
      await dbops.admindata.update(
        { password: passwordNew },
        { where: { username: req.body.username } }
      );
      res.status(200).json("password updated");
    }
    else{
      res.status(400).json('you are not authorized for above action')
    }
  }
  } catch (error) {
    console.log(error);
   res.status(400).json("invalid user")
  }
};
module.exports = { register, login, readtasks, updateTaskStatus,changePassword };
