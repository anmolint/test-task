const dbops = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const data = validationResult(req);
    if (!data.isEmpty()) {
      res.send(data);
    }
    let user = await dbops.admindata.findOne({
      where: { username: req.body.username },
    });
    if (user.role == "manager") {
      let decryption = await bcrypt.compare(req.body.password, user.password);
      if (decryption == true) {
        let token = jwt.sign({ user_id: user.id }, process.env.key, {
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
    let uid = req.user.user_id;

    let userList = await dbops.admindata.findAll({
      include: ["myUsers"],
      where: {
        id: uid,
      },
    });
    res.send(userList);
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
    const data = validationResult(req);
    if (!data.isEmpty()) {
      res.send(data);
    }
    let uid = req.user;
    let taskcreate = await dbops.taskcreate.create({
      managerId: uid.user_id,
      description: req.body.description,
      status: req.body.status,
    });
    let token = jwt.sign({ user_id: taskcreate.id }, process.env.key, {
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
    const data = validationResult(req);
    if (!data.isEmpty()) {
      res.send(data);
    }
    let uid = req.user;
    let tid = jwt.verify(req.headers.tid, process.env.key);
    let taskcreate = await dbops.taskcreate.update(
      {
        description: req.body.description,
        status: req.body.status,
      },
      { where: { managerid: uid.user_id, id: tid.user_id } }
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
    let tid = jwt.verify(tkn, process.env.key);
    let task = await dbops.taskcreate.findOne({
      where: { id: tid.user_id },
    });
    if (task) {
      await dbops.taskcreate.destroy({ where: { id: uid.user_id } });
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
    const data = validationResult(req);
    if (!data.isEmpty()) {
      res.send(data);
    }
    let uid = req.user;
    let tid = jwt.verify(req.headers.taskid, process.env.key);
    let user = await dbops.admindata.findOne({
      where: { username: req.body.user },
    });
    if (user.managerId !== uid.user_id) {
      res.send("user is not assigned to you");
    } else {
      let assignTask = dbops.taskassgin.create({
        taskId: tid.user_id,
        userId: user.id,
      });
      if (assignTask) {
        res.status(200).send("task assigned");
      } else {
        res.status(400).send();
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
const rateTask = async (req, res) => {
  try {
    const data = validationResult(req);
    if (!data.isEmpty()) {
      res.send(data);
    }
    let tid = jwt.verify(req.headers.tid, process.env.key);
    let task = await dbops.taskcreate.findOne({ where: { id: tid.user_id } });
    if (task.status !== "completed") {
      res.send("task not completed");
    } else {
      await dbops.taskcreate.update(
        { rating: req.body.rating },
        { where: { id: task.id } }
      );
      res.send("task rated ");
    }
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
  rateTask,
};
