const router = require("express").Router();
const managercrud =require("../controllers/managercontrol")
const auth = require("../middleware/managerauth")
router.post('/login/maneger',managercrud.login)
router.get("/maneger/getuser",auth,managercrud.checkUsers)
router.post('/maneger/createtask',auth,managercrud.createtask)
router.post('/maneger/updatetask',auth,managercrud.updateTask)
router.delete("/maneger/delete",auth,managercrud.deletetask)
router.post("/maneger/assigntask",auth,managercrud.assigntask)
module.exports = router