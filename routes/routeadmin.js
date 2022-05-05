const router = require("express").Router();
const admincrud = require("../controllers/admincontrol");
const auth = require("../middleware/adminauth");
const validator =require('../validator/validator')
router.post("/admin/register",validator.validregistor, admincrud.register);
router.post("/admin/login",validator.validlogin, admincrud.login);
router.post("/admin/updateroles",validator.validroleassign, auth, admincrud.updateroles);
router.post("/admin/assign_users", auth, admincrud.assignuser);
router.put("/admin/unassignmanager", auth, admincrud.unassignmanager);
router.post('/admin/changepassword', auth, admincrud.changePassword);
router.post('/admin/getuser', auth, admincrud.readUserTasks)
module.exports = router;
