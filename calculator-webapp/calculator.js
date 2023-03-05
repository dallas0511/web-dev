const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/bmicalculator",function(req,res){
  res.sendFile(__dirname+"/bmiCalculator.html");
});

app.post("/bmicalculator",function(req,res){
  var height = Number((req.body.height)/100);
  var weight = Number(req.body.weight);
  var bmi = weight/(height*height);
  res.send("Your BMI is "+bmi);

});
app.listen(1997,function(){
  console.log("Port:1997 Start");
})
