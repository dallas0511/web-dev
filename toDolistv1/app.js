const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");

var items = [];
var worklist =[];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("Public"));



app.get("/", function(req, res) {

   let day = date.getDay();

   res.render("list", {
     lisTitle: day,
     addNew: items
   });

});

app.post("/", function(req, res) {
  var item = req.body.newList;

  if(req.body.list ==="Work"){
    worklist.push(item);
    res.redirect("/work")
  }
  else{
    items.push(item);
    res.redirect("/")
  }


  res.redirect("/");
});

app.get("/work",function(req,res){
  res.render("list",{lisTitle:"Work list",addNew:worklist});

});





app.listen(3000, function() {
  console.log("Port 3000 currently running!");
})
