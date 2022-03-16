const dbops = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    if (user.role == "maneger") {
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
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const checkUsers = async (req, res) => {
  try {
    let uid = req.user;
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',uid)
    let userlist = await dbops.assinment.findAll({
      where: {
        maneger: uid.user_id,
      }
    });
    res.send(userlist);
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const createtask = async (req, res) => {
  try {
    let uid = req.user;
    let taskcreate = await dbops.taskcreate.create({
      manegerid: uid.user_id,
      task: req.body.task,
      status: req.body.status,
    });
    let token = jwt.sign({ user_id: taskcreate.id }, "abcd", {
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
const updateTask = async (req, res) => {
  try {
    let uid = req.user;
    let taskcreate = await dbops.taskcreate.update(
      {
        task: req.body.task,
      },
      { where: { manegerid: uid.user_id } }
    );
    res.send("task updated");
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const deletetask = async (req, res) => {
  try {
    let uid = req.user;
    let task = await dbops.taskcreate.findOne({
      where: { id: uid.registration },
    });
    if (task) {
      await dbops.destroy({ where: { id: uid.registration } });
      res.send("task deleted");
    } else {
      res.send("no such task");
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const assigntask = async (req, res) => {
  try {
    let mid = req.user;
    let tskid = req.header.taskid;
    let tid = jwt.verify(tskid, "abcd");
    let user = dbops.admindata.findOne({ where: { username: req.body.user } });
    let assignTask = dbops.taskassgin.create({
      taskid: tid.registration,
      manegerid: mid.registration,
      userid: user.id,
    });
    let token = jwt.sign({ user_id: assignTask.id }, "abcd", {
      expiresIn: "1h",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
module.exports = {
  login,
  checkUsers,
  createtask,
  updateTask,
  assigntask,
  deletetask,
};
