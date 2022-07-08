const router = require("express").Router();
const usercrud = require("../controllers/usercontrol")
const auth = require("../middleware/userauth")
const validator =require('../validator/validator')
router.post('/user/register',validator.validregistor, usercrud.register)
router.post('/user/login',validator.validlogin, usercrud.login)
router.get('/user/tasks', auth, usercrud.readtasks)
router.put('/user/updateTaskStatus',validator.taskstatus, auth, usercrud.updateTaskStatus)
router.post('/user/changepassword',validator.validchangepass, usercrud.changePassword);
module.exports = router