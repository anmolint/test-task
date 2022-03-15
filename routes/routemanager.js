const router = require("express").Router();
const managercrud =require("../controllers/managercontrol")
const auth = require("../middleware/managerauth")
router.post('/login/maneger',managercrud.login)
router.post('/maneger/createtask',auth,managercrud.createtask)
router.post('/maneger/updatetask',auth,managercrud.updateTask)
module.exports = router