const { request } = require("express");
const express = require("express");
const mongoose = require("mongoose"); 
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = require("../models/post"); 
const User = require("../models/user");

router.get("/user/:id", requireLogin, (req, res) => {
    User.findOne({_id: req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy: req.params.id})
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user, posts})  
        })
    }).catch(err=>{
        return res.status(404).json({error:err})
    })
})

router.put("/follow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId,{
        $push:{ followers: req.user._id }
    },{
        new:true
    }, (err, result)=>{
        if(err){
            return res.status(422).json({message:err})
        }
            User.findByIdAndUpdate(req.user._id,{
                $push:{ following: req.body.followId }
            }, {new:true}, (err, data)=>{
                if(err){
                    console.log(err)
                } else {
                    res.json(data)
                }
            })
        })
    })


router.put("/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{ followers: req.user._id }
    },{
        new:true
    }, (err, result)=>{
        if(err){
            return res.status(422).json({message:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{ following: req.body.unfollowId }
        }, {new:true}, (err, result)=>{
            if(err){
                console.log(err)
            } else {
                res.json(result)
            }
        })
    })
})

router.put("/updateimage", requireLogin, (req,res)=>{
    User.findByIdAndUpdate(req.user._id, { $set: { image:req.body.image }}, {new:true}, (err, result) => {
        if(err){
            return res.status(422).json({message:err});
        } 
        res.json(result)
    })
})

router.get('/get-following', requireLogin, (req, res) => {
    console.log('working')
    User.findById(req.user._id)
    .populate('following', 'name')
    .then(following => {
        res.status(200).json({following})
        console.log(following);
    })
    .catch(err => {
        res.status(400).json(err)
    })
})

router.post('/search-users', (req,res) => {
    let userPattern = new RegExp('^' + req.body.query)

    User.find({name:{$regex: userPattern}})
    .select('_id name')
    .then(user => {
        res.send({user:user})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router;