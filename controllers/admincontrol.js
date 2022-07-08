const dbops = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult }
    = require('express-validator');
const User = require("../models/user");
require("dotenv").config();
const register = async (req, res) => {
  try {
    const data = validationResult(req)
    if (!data.isEmpty()) {
        res.status(400).send(data)
    }
    if(req.body.password!==req.body.confpass){
      res.status(400).json("passwords do not match")
    }
    let saltRounds = await bcrypt.genSalt(10);
    let encrypt = await bcrypt.hashSync(req.body.password, saltRounds);
    let admindatacreate = await dbops.admindata.create({
      username: req.body.username,
      password: encrypt,
      email: req.body.email,
      role: "admin",
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
    res.status(400).send(error);
  }
};
const login = async (req, res) => {
  try {  const data = validationResult(req)
    if (!data.isEmpty()) {
        res.status(400).json(data)
    }
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    if (user) {
      if (user.role === "admin") {
        let decryption = await bcrypt.compare(req.body.password, user.password);
        if (decryption === true) {
          let token = jwt.sign({ user_id: user.id }, process.env.key, {
            expiresIn: "1h",
          });
          res.status(200).json(token);
        }
        else if(decryption === false){
          res.status(400).json("invalid password")
        }
      }
       else if (user.role == "manager")
      {
        res.status(400).json("You dont have required privileges");
      }
       else if (user.role == "user")
        {
        res.status(400).json("you dont have reqired privileges");
        }
    } else {
      res.status(400).json("Invalid Password");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error)
  }
};
const updateroles = async (req, res) => {
  try {  const data = validationResult(req)
    if (!data.isEmpty()) {
        res.status(400).send(data)
    }
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    await dbops.admindata.update(
      { role: req.body.newrole },
      { where: { username: user.username } }
    );
    res.status(200).json("role updated");
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
};
const assignuser = async (req, res) => {
  try { 
     const data = validationResult(req)
    if (!data.isEmpty()) {
       res.status(400).json(data)
    }
    let manager = await dbops.admindata.findOne({
      where: { username: req.body.manager },
    });
    let user = await dbops.admindata.findOne({
      where: { username: req.body.user },
    });
    let isUserAssigned = user.managerId
    if (isUserAssigned !== null) {
      res.status(400).json('user already assigned');
    } {

      if (manager.role !== "manager") {
        res.status(400).json("invalid role");
      } else if (user.role !== "user") {
        res.status(400).json("invalid assignment");
      } else {
        await dbops.admindata.update(
          { managerId: manager.id },
          { where: { id: user.id } }
        );
        res.status(200).json("user assigned a manager");
      }
    }
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
};
const unassignmanager = async (req, res) => {
  try {  const data = validationResult(req)
    if (!data.isEmpty()) {
       res.status(400).json(data)
    }
    let manager = await dbops.admindata.findOne({
      where: { username: req.body.manager },
    });
    let user = await dbops.admindata.findOne({
      where: { username: req.body.user },
    });
    let isManagerAssigned = user.managerId === manager.id ? true : false;

    if (isManagerAssigned) {
      await dbops.admindata.update(
        { managerId: null },
        { where: { id: user.id } }
      );
    }
    res.status(200).json("successfully unassigned manager");
    
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
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
    if (!user) {
      res.status(400).json("invalid username");
    } else {
      let saltRounds = await bcrypt.genSalt(10);
      let passwordNew = await bcrypt.hashSync(req.body.newpassword, saltRounds);
      await dbops.admindata.update(
        { password: passwordNew },
        { where: { username: req.body.username } }
      );
      res.status(200).send("password updated");
    }
  } catch (error) {
    console.log(error);
   res.status(400).json("invalid user")
  }
};
const readUserTasks = async (req, res) => {
  try {
    const data = validationResult(req)
    if (!data.isEmpty()) {
       res.status(400).json(data)
    }
    let user = await dbops.admindata.findOne({where:{username:req.body.username}})
    let tasks = await dbops.admindata.findAll({
      include: 
        {
          model:User ,
          as:"myUsers",
          include: ["tasks"]
        },
        where:{id:user.id}
       
    });
    res.status(200).json(tasks)
  }
  catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
}
module.exports = {
  register,
  login,
  updateroles,
  assignuser,
  unassignmanager,
  changePassword,
  readUserTasks
};
