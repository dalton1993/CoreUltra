const express = require("express");
const app = express(); 
const mongoose = require("mongoose"); 
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const { MONGOURI } = require("./config/keys");
mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on("connected", () => {
    console.log("connected to mongo")
});
mongoose.connection.on("error", (err) => {
    console.log("connection error to mongo")
});

const User = require("./models/user");
const Post = require("./models/post"); 

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(bodyParser.urlencoded({extended:true}));


if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'))
    })
}





app.listen(PORT, () => {
    console.log("server is runing on port 5000");
});