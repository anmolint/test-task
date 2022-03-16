const dbops = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const register = async (req, res) => {
  try {
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
  try {
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
      } else if (user.role == "maneger") {
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
  try {
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
    let maneger = await dbops.admindata.findOne({
      where: { username: req.body.manger },
    });
    let user = await dbops.admindata.findOne({
      where: { username: req.body.user },
    });
    // let checkIfassigned = await dbops.assinment.findOne({
    //   where: { userid: user.id },
    // });
    // console.log('********************************************',checkIfassigned)
    // if (checkIfassigned) {
    //   res.send("user is already assigned unassign first");
    // } else {
      if (maneger.role != "maneger") {
        res.send("invalid role ");
      } else if (user.role != "user") {
        res.send("invalid assignment");
      } else {
        await dbops.assinment.create({
          maneger: maneger.id,
          user: user.id,
        });
        res.send("user assigned a maneger");
      }
    // }
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const unassignmanager = async (req, res) => {
  try {
    let maneger = await dbops.admindata.findOne({
      where: { username: req.body.manger },
    });
    let user = await dbops.admindata.findOne({
      where: { username: req.body.user },
    });
    let checkIfassigned = await dbops.assinment.findOne({
        where: { userid: user.id },
      });
      if(checkIfassigned){
          await dbops.assinment.destroy({where:{userid:user.id}});
          res.send("maneger unassigned");
      }
    
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

module.exports = {
  register,
  login,
  updateroles,
  assignuser,
  unassignmanager,
  changePassword,
};
