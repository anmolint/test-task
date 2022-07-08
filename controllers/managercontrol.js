const dbops = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const data = validationResult(req);
    if (!data.isEmpty()) {
     res.status(400).json(data);
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
       res.status(200).json(token);
      }
    } else {
     res.status(400).json("invalid login ");
    }
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
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
   res.status(200).json(userList);
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
};
const createtask = async (req, res) => {
  try {
    const data = validationResult(req);
    if (!data.isEmpty()) {
     res.status(400).json(data);
    }
    let uid = req.user;
    let taskcreate = await dbops.taskcreate.create({
      managerId: uid.user_id,
      description: req.body.description,
      status: req.body.status,
    });
   res.status(200).json(taskcreate.id);
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
};
const updateTask = async (req, res) => {
  try {
    const data = validationResult(req);
    if (!data.isEmpty()) {
     res.status(400).json(data);
    }
    let uid = req.user;
    let tid = req.body.taskId
    let taskcreate = await dbops.taskcreate.update(
      {
        description: req.body.description,
        status: req.body.status,
      },
      { where: { managerid: uid.user_id, id: tid } }
    );
   res.status(200).json("task updated");
  } catch (error) {
    console.log(error);
   res.status(400).json("you cannot update the task")
  }
};
const deletetask = async (req, res) => {
  try {const data = validationResult(req);
    if (!data.isEmpty()) {
     res.status(400).json(data);
    }
    let uid = req.user;
    let tid = req.body.taskId;
    let task = await dbops.taskcreate.findOne({
      where: { id: tid },
    });
    if (task.managerId==uid.user_id) {
      await dbops.taskcreate.destroy({ where: { id: tid } });
     res.status(200).json("task deleted");
    } else {
     res.status(400).json("no such task");
    }
  } catch (error) {
    console.log(error);
   res.status(400).json("you did not create such task")
  }
};
const assigntask = async (req, res) => {
  try {
    const data = validationResult(req);
    if (!data.isEmpty()) {
     res.status(400).json(data);
    }
    let uid = req.user;
    let tid = req.body.taskId
    let user = await dbops.admindata.findOne({
      where: { username: req.body.user },
    });
    let task = await dbops.taskcreate.findOne({where:{id:tid}})
    if (user.managerId !== uid.user_id) {
     res.status(400).json("user is not assigned to you");
    } else {
      if(uid.user_id==task.managerId){
      let assignTask = dbops.taskassgin.create({
        taskId: tid,
        userId: user.id,
      });
      if (assignTask) {
        res.status(200).json("task assigned");
      } }else {
        res.status(400).json("task cannot be assigned");
      }
    }
  } catch (error) {
    console.log(error);
   res.status(400).json(error)
  }
};
const rateTask = async (req, res) => {
  try {
    const data = validationResult(req);
    if (!data.isEmpty()) {
     res.status(400).json(data);
    }
    let uid = req.user
    let tid = req.body.taskId
    let task = await dbops.taskcreate.findOne({ where: { id:tid } });
    if(uid.user_id==task.managerId){
    if (task.status !== "completed") {
     res.status(400).json("task not completed");
    } else {
      await dbops.taskcreate.update(
        { rating: req.body.rating },
        { where: { id: task.id } }
      );
     res.status(200).json("task rated ");
    }}
    else{res.status(400).json("you cannot rate task")}
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
    }
     else
      {
      if(user.role==="manager"||user.role==="user")
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
module.exports = {
  login,
  checkUsers,
  createtask,
  updateTask,
  assigntask,
  deletetask,
  rateTask,changePassword
};
