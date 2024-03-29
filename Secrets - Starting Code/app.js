require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const encrypt = require('mongoose-encryption');
const ejs = require("ejs");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const FacebookStrategy = require("passport-facebook");
const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false
}));



app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://127.0.0.1:27017/UserDB");

const userSchema = new mongoose.Schema({
  email:String,
  password:String,
  googleId:String,
  facebookId:String,
  secret:String

});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//---------------encryption------------------//
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["password"]});
//---------------encryption------------------//

//---------------hashing------------------//
// console.log(md5("123456"));
//---------------hashing------------------//


const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",function(req,res){
  res.render("home");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });


  app.get('/auth/facebook',
    passport.authenticate('facebook',{ scope: ['profile'] }));

  app.get('/auth/facebook/secrets',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/secrets');
    });

app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user,function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
});



app.get("/secrets",function(req,res){
  User.find({"secret":{$ne:null}},function(err,foundSecret){
    res.render("secrets",{
      userSecretShow:foundSecret
    });
  });
});

app.route("/submit")
.get(function(req,res){
  if(req.isAuthenticated()){
    res.render("submit");
  }else{
    res.redirect("/login");
  }
})
.post(function(req,res){
  console.log(req.user._id);
  let submitsecret = req.body.secret;

  User.findById(req.user._id,function(err,foundId){
    if(err){
      console.log(err);
    }else{
      if(foundId){
        foundId.secret = submitsecret;
        foundId.save(function(err){if(err){console.log(err);}else{res.redirect("/secrets")}});
      }
    }
  });
});

app.get("/logout",function(req,res){
  req.logout(function(err){console.log(err);});
  res.redirect("/");
});



app.listen(3000,function(){
  console.log("Server start running on Port 3000");
});
