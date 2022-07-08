const router = require("express").Router();
const managercrud = require("../controllers/managercontrol");
const auth = require("../middleware/managerauth");
const validator =require('../validator/validator');
const { route } = require("./routeadmin");
router.post("/manager/login",validator.validlogin, managercrud.login);
router.get("/manager/getuser", auth, managercrud.checkUsers);
router.post("/manager/createtask",validator.validtask, auth, managercrud.createtask);
router.put("/manager/updatetask",validator.validtaskupdate, auth, managercrud.updateTask);
router.delete("/manager/deleteTask",validator.deletetask, auth, managercrud.deletetask);
router.post("/manager/assigntask",validator.validassigned, auth, managercrud.assigntask);
router.put('/manager/ratetask',validator.taskrate,auth,managercrud.rateTask)
router.post('/manager/changepassword',validator.validchangepass,  managercrud.changePassword);
module.exports = router;
