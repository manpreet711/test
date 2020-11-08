const express = require ('express');
const db = require('../models');
const router = express.Router();
const{check, validationResult} = require('express-validator');
const { signup,signin,getOneUser,signout,updateUser,checkAuth,removeUser } = require('../controller/user');

//Signup Route
router.post('/signup',
[
check("firstName").isLength({ min:3 }).withMessage('Name must be at least 3 chars long'),
check("lastName").isLength({ min: 3 }).withMessage('Name must be at least 3 chars long'),
check("email").isEmail().withMessage('Please enter correct email address'),
check("password").isLength({ min: 6 }).withMessage('Password length should be minium 6 char long')
],
signup);

//Sign In Route
router.post("/signin",[
check("email").isEmail().withMessage('Please enter valid email address'),
check("password").isLength({ min: 6 }).withMessage('Please enter valid password')
], signin);

//Update Route
router.put("/update/:id",checkAuth,updateUser);

//Remove User
router.delete("/delete/:id",removeUser)

//Sign out Route
router.post("/signout",signout);

//Get one user
router.get("/user/:id",getOneUser)

//Get all users
router.get ('/all',(req,res) => {
    db.user.findAll().then((newuser) => res.send(newuser));
});


module.exports = router;
