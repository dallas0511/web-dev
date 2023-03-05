const express = require("express");
const app = express();

app.get("/",function(req,res){
  res.send("hello user!!");
});

app.get("/about",function(req,res){
  res.send("it's my bio<br><h1>I like to Learn stuff</h1>");
});

app.listen(1999,function(){
  console.log("Start the server Port: 1999");
});
