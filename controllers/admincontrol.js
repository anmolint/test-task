const dbops = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult }
    = require('express-validator');
const User = require("../models/user");
const register = async (req, res) => {
  try {
    const data = validationResult(req)
    if (!data.isEmpty()) {
        res.send(data)
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
    let token = jwt.sign({ registration: admindatacreate.id }, "abcd", {
      expiresIn: "1h",
    });
    res.send(token);
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const login = async (req, res) => {
  try {  const data = validationResult(req)
    if (!data.isEmpty()) {
        res.send(data)
    }
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    if (user) {
      if (user.role === "admin") {
        let decryption = await bcrypt.compare(req.body.password, user.password);
        if (decryption == true) {
          let token = jwt.sign({ user_id: user.id }, "abcd", {
            expiresIn: "1h",
          });
          res.send(token);
        }
      } else if (user.role == "manager") {
        res.send("not allowed");
      } else if (user.role == "user") {
        res.send("not allowed");
      }
    } else {
      res.send("Invalid Password");
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const updateroles = async (req, res) => {
  try {  const data = validationResult(req)
    if (!data.isEmpty()) {
        res.send(data)
    }
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    await dbops.admindata.update(
      { role: req.body.newrole },
      { where: { username: user.username } }
    );
    res.send("role updated");
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const assignuser = async (req, res) => {
  try { 
     const data = validationResult(req)
    if (!data.isEmpty()) {
        res.send(data)
    }
    let manager = await dbops.admindata.findOne({
      where: { username: req.body.manager },
    });
    let user = await dbops.admindata.findOne({
      where: { username: req.body.user },
    });
    let isUserAssigned = user.managerId
    if (isUserAssigned !== null) {
      res.send('user already assigned');
    } {

      if (manager.role !== "manager") {
        res.send("invalid role");
      } else if (user.role !== "user") {
        res.send("invalid assignment");
      } else {
        await dbops.admindata.update(
          { managerId: manager.id },
          { where: { id: user.id } }
        );
        res.send("user assigned a manager");
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const unassignmanager = async (req, res) => {
  try {  const data = validationResult(req)
    if (!data.isEmpty()) {
        res.send(data)
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
    res.status(200).send({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const changePassword = async (req, res) => {
  try {
    let user = await dbops.admindata.findOne({
      where: { username: req.body.user },
    });
    if (!user) {
      res.send("invalid username");
    } else {
      let saltRounds = await bcrypt.genSalt(10);
      let passwordNew = await bcrypt.hashSync(req.body.password, saltRounds);
      await dbops.admindata.update(
        { password: passwordNew },
        { where: { username: req.body.username } }
      );
      res.send("password updated");
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const readUserTasks = async (req, res) => {
  try {
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
    res.send(tasks)
  }
  catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
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
