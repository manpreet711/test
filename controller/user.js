const db = require('../models');
const{check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const KEY = require ('../backend');

exports.signup = (req,res) => {

    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(422).json({
            error:error.array()[0].msg
        });
    }
    //Hashing password
    bcrypt.genSalt(10,function(err,salt) {
        bcrypt.hash(req.body.password,salt,function(err,hash)  {
            const user ={
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                age:req.body.age,
                email:req.body.email,
                password:hash
            }
                //saving user
                db.user.create( user )
                .then( (user) => { res.send(user)})
                .catch( (err) => {
                    res.status(500).json({
                        message:"Something went wrong"
                    })
                    console.log("Error:-",err)
                });
        });
    });
    
};

exports.signin = (req,res) => {
    //find user
    const newuser =  db.user.findOne({ where: { email: req.body.email } })
    // db.user.findOne({Where:{email:req.body.email}})
    .then( (newuser) => {
        if(newuser === null){
            res.status(401).json({
                message:"Invalid credentials "
            });
        }else{bcrypt.compare(req.body.password,newuser.password,function(err,result) {
            if(result){
                //Create token
                const token = jwt.sign({email:newuser.email},
                    'KEY',
                    function(err,token){
                        if(err){
                        res.status(401).json({     
                            message:"err in generating token ",
                            
                        });
                        }else{
                            res.status(200).json({     
                                message:"Auth sucessfull ",
                                token:token
                            }); 
                        }
                    }
                );
                //     //Put token in cookie (key,value) pair
                // res.cookie("token",token,{expire:new Date() + 9999})
                //     //send response to frontend 
                // const {id,firstName,age,email} = db.user;
                // return res.json({token,user:{id,firstName,age,email}});
            }else{
                    res.status(401).json({
                        message:"Password do not match"
                    });
                };
            });
        }
     })
     .catch(err => {
         res.status(500).json({
             message:"Something went wrong"
            });
     });
};

exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message:"User Signout Sucessfully"
    });
}

// Getting user 
exports.getOneUser = (req,res) => {
    const id = req.params.id
    db.user.findByPk(id).then(result => {
        if(result){
        res.status(200).json(result);
        }else{
            res.status(404).json({
                message:"Something went wrong!"
            })
        }
    })
    .catch( error => {
        res.status(500).json({
            message:"Something went wrong"
        });
    });
};

//custon midleware
exports.checkAuth = (req,res,next) => {
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null)return res.status(401)

        jwt.verify(token,'KEY')
        next();
    }catch (err) {
        return res.status(401).json({
            message:"Invalid or expired token provided!",
            error:err
        });
    }
};

exports.updateUser = (req,res) => {
    const id =req.params.id;
    const updatedPost = {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        age:req.body.age,
        email:req.body.email,
    };

    db.user.update(updatedPost,{where:{id:id}})
    .then(result => {
        if(result){
            res.status(200).json({
                message:"User updated successfully"
            });
        }else{
            res.status(401).json({
                message:"Request failed"
            }); 
        }
    })
    .catch(err => {
        res.status(500).json({
            message:"Something went wrong",
            error: err
        });
    })
};

exports.removeUser = (req,res) => {
    const id = req.params.id;

    db.user.destroy({where:{id:id}})
    .then( () => {
        res.status(200).json({
            message:"User Deleted successfully"
        });
    })
    .catch(err => {
        res.status(500).json({
            message:"Something went wrong",
            error: err
        });
    })

}