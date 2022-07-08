const { check } = require('express-validator')
const validregistor = [
    check('username', 'username cant be empty').not().isEmpty(),
    check('password', "password cant be empty").not().isEmpty(),
    check('confpass', 'cannot be empty').not().isEmpty(),
    check('email', 'email cant be empty').exists().isEmail(),
    check('phonenumber', 'phonenumber cant be empty').exists().matches(/^\d{10}$/),
    check('firstname', 'firstname cant be empty').not().isEmpty(),
    check('lastname', 'lastname cant be empty').not().isEmpty(),

];
const validlogin = [
    check('username', 'username cannot be empty').not().isEmpty(),
    check('password', 'password cannot be empty').not().isEmpty(),
];
const validroleassign = [
    check('username', 'user cannot be empty').not().isEmpty(),
    check('newrole', 'role cannot be empty').not().isEmpty()
]
const validuserassign=[
    check('manager','manager field cannot be empty').not().isEmpty(),
    check('user','user cannot be empty').not().isEmpty()
]
const validtask = [
    check('description', 'task descripton cant be empty').not().isEmpty(),
    check('status', 'please enter correct status').not().isEmpty()
];
const validtaskupdate=[
    check('taskId', 'please enter a valid taskid').exists().isInt(),
    check('description', 'task descripton cant be empty').not().isEmpty(),
    check('status', 'please enter correct status').not().isEmpty()
]
const deletetask=[
    check('taskId', 'please enter a valid taskid').exists().isInt()
]
const validchangepass=[
    check('username','please enter a valid username').not().isEmpty()
]
const validassigned = [
    check('taskId', 'please enter a valid taskid').exists().isInt(),
    check('user', 'user cannot be empty').not().isEmpty()
];
const taskstatus = [
    check('taskId', 'please enter a valid taskid').exists().isInt(),
    check('status', 'please enter correct status').not().isEmpty()
]
const taskrate = [
    check('taskId', 'please enter a valid taskid').exists().isInt(),
    check('rating', 'please enter correct rating').not().isEmpty()
];
const validuserdetail=[
    check('username','please enter a valid username').not().isEmpty()
]
module.exports = {
    validregistor, validlogin, validtask, validassigned, validroleassign, taskstatus, taskrate,deletetask,validchangepass,validuserassign ,validuserdetail,validtaskupdate
}