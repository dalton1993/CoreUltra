const express = require("express");
const mongoose = require("mongoose"); 
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config/keys")
const requireLogin = require("../middleware/requireLogin")




router.get("/", (req, res)=>{
    res.render("test.ejs");
});

router.get("/protected", requireLogin, (req, res) => {
    res.send("Hello User");
})

router.post("/signup", (req, res) => {
    const { name, email, password, image } = req.body;
    if(!email || !password || !name){
       return res.status(422).json({error: "please add all the fields"});
    }
    User.findOne({email: email}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error: "user already exists with that email"});
        }
        bcrypt.hash(password,12)
            .then(hashedpassword => {
                const user = new User({
                    email: email,
                    password: hashedpassword,
                    name: name,
                    image:image 
                })
                user.save()
                .then(user => {
                    res.json({message:"saved user"});
                })
                .catch(err => {
                    console.log(err); 
                })
            })
            .catch(err =>{
                console.log(err); 
            }); 
        })
});

router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(422).json({error:"please enter email and pasword"});
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
           return res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({ _id: savedUser._id}, JWT_SECRET )
                // res.json({message:"succesfully signed in"})
                const { _id, name, email, following, followers, image } = savedUser
                res.json({token:token, user: { _id, name, email, followers, following, image }})
            } else {
                return res.status(422).json({error:"invalid email or password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
});




module.exports = router; 