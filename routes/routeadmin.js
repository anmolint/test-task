const router = require("express").Router();
const admincrud =require("../controllers/admincontrol")
const auth =require('../middleware/adminauth')
router.post('/admin/register',admincrud.register)
router.post('/admin/login',admincrud.login)
router.post('/admin/updateroles',auth,admincrud.updateroles)
router.post('/admin/assign_roles',auth,admincrud.assignuser)
router.delete('/admin/unassignManeger',auth,admincrud.unassignmanager)
module.exports = router