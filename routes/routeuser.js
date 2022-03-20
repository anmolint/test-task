const router = require("express").Router();
const usercrud = require("../controllers/usercontrol")
const auth = require("../middleware/userauth")
const validator =require('../validator/validator')
router.post('/user/register',validator.validregistor, usercrud.register)
router.post('/user/login',validator.validlogin, usercrud.login)
router.get('/user/tasks', auth, usercrud.readtasks)
router.put('/user/updateStatus',validator.taskstatus, auth, usercrud.updateTaskStatus)
module.exports = router