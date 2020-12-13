const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:"https://res.cloudinary.com/dgccfh9zu/image/upload/v1601948845/anonymous_kouq6i.webp"
    },
    followers:[{ type:ObjectId, ref: "User" }],
    following:[{ type:ObjectId, ref: "User" }]
});

module.exports = mongoose.model("User", userSchema);