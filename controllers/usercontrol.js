const dbops = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const register = async (req, res) => {
  try {
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
    let token = jwt.sign({ registration: admindatacreate.id }, process.env.key, {
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
  try {
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    if (user) {
      let decryption = await bcrypt.compare(req.body.password, user.password);
      if (decryption == true) {
        let token = jwt.sign({ user_id: user.id }, process.env.key, {
          expiresIn: "1h",
        });
        res.send(token);
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
const readtasks = async (req, res) => {
  try {
    let uid = req.user;
    let tasks = await dbops.admindata.findAll({
      include: ["tasks"],
      where: { id: uid.user_id },
      through: { attributes: [] },
    });
    res.send(tasks);
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    let uid = req.body.user_id;
    let tid = req.body.taskid;
    await dbops.taskcreate.update(
      { status: req.body.status },
      { where: { id: tid } }
    );
    res.send("status updated");
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
module.exports = { register, login, readtasks, updateTaskStatus };
