const router = require("express").Router();
const managercrud = require("../controllers/managercontrol");
const auth = require("../middleware/managerauth");
const validator =require('../validator/validator');
const { route } = require("./routeadmin");
router.post("/manager/login",validator.validlogin, managercrud.login);
router.get("/manager/getuser", auth, managercrud.checkUsers);
router.post("/manager/createtask",validator.validtask, auth, managercrud.createtask);
router.put("/manager/updatetask",validator.validtask, auth, managercrud.updateTask);
router.delete("/manager/delete", auth, managercrud.deletetask);
router.post("/manager/assigntask",validator.validassigned, auth, managercrud.assigntask);
router.put('/manager/ratetask',validator.taskrate,auth,managercrud.rateTask)
module.exports = router;
