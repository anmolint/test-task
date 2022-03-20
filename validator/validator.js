const { check } = require('express-validator')
const validregistor =[
    check('username', 'username cant be empty').not().isEmpty(),
    check('password', "password cant be empty").not().isEmpty(), 
    check('email', 'email cant be empty').not().isEmpty(),
    check('phonenumber','phonenumber cant be empty').not().isEmpty(),
    check('firstname', 'firstname cant be empty').not().isEmpty(),
    check('lastname', 'lastname cant be empty').not().isEmpty(),
  
  ];
  const validlogin =[
    check('username','username cannot be empty').not().isEmpty(),
    check('password','password cannot be empty').not().isEmpty(),
  ];
  const validroleassign=[
      check('username','user cannot be empty').not().isEmpty(),
      check('newrole','role cannot be empty').not().isEmpty()
  ]
  const validtask =[
      check('description','task descripton cant be empty').not().isEmpty(),
      check('status','please enter correct status').not().isEmpty()
  ];
  const validassigned =[
      check('user','user cannot be empty').not().isEmpty()
  ]; 
  const taskstatus=[
      check('status','please enter correct status').not ().isEmpty()
  ]
  const taskrate = [
      check('rating','please enter correct rating').not().isEmpty()
  ];
  module.exports = {
    validregistor,validlogin,validtask,validassigned,validroleassign,taskstatus,taskrate
  }