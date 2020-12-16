//jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

let app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
///////////////////////////////////////LEVEL 1 Security- Username & password stored in DB/////////////////////////////////////////////////////////////////////////////////////

// const userSchema = {
//   email: String,
//   password: String
// }
// const User = mongoose.model("User", userSchema);

///////////////////////////////////////LEVEL 2 Security- Encrypted password/////////////////////////////////////////////////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//const secretKey = "sfdghjkljhugfdsgthjuklocghjkjhgf";

///////////////////////////////////////LEVEL 3 Security- Encrypted password in source code using env variables/////////////////////////////////////////////////////////////////////////////////////////////////
const secretKey = process.env.SECRET_KEY;
 
userSchema.plugin(encrypt,{secret:secretKey, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const user = new User({
    email:req.body.username,
    password:req.body.password
  });
  user.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }else{
        console.log("No such user exists");
      }
    }
  });
});









app.listen(3000, function() {
  console.log("Server has started successfully on port 3000");
});
