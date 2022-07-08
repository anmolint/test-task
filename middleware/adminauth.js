const jwt = require("jsonwebtoken");
const dbops = require("../models/index");
require("dotenv").config();
const tokenVerification = async (req, res, next) => {
  try {
    const bearerhead = req.headers["authorization"];
    const bearsplit = bearerhead.split(" ");
    const tkn = bearsplit[1];
    if (!tkn) {
     res.status(400).json("unauthorized");
    } else {
      let decode = jwt.verify(tkn, process.env.key);
      let user = await dbops.admindata.findOne({
        where: { id: decode.user_id },
      });
      console.log(user);
      if (user.role === "admin") {
        req.user = decode;
        next();
      } else {
       res.status(400).json("you dont have reqired permission");
      }
    }
  } catch (error) {
    console.log(error);
    res.
      status(400).
       json({error:"authorization reqired"})
    ;
  }
};
module.exports = tokenVerification;
