const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("Public"));

mongoose.connect("mongodb://localhost:27017/WikiDB");

const wikischema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", wikischema);
//-------------------------search all the article------------------------------//
app.route("/articles").get(function(req, res) {
  Article.find(function(err, foundarticle) {
    if (!err) {
      res.send(foundarticle);
    } else {
      console.log(err);
    }
  });
}).post(function(req, res) {

  const savearticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  savearticle.save().then(console.log("Sucessful save"));

}).delete(function(req, res) {
  Article.deleteMany({}, function(err) {
    if (!err) {
      console.log("Successful Delete!");
    } else {
      console.log(err);
    }

  });
});
//----------------------search specific the article----------------------------//
app.route("/articles/:searchTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.searchTitle
    }, function(err, searchTitle) {
      if (searchTitle) {
        res.send("Successfully found name with " + searchTitle);
      } else {
        res.send("Woops! Something went wrong " + err);
      }
    })
  })
  .put(function(req, res) {
    Article.updateOne({
        title: req.params.searchTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      function(err) {
        if (!err) {
          res.send("Update successfully");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.updateOne({
      title: req.params.searchTitle
    }, {
      $set: req.body
    }, function(err) {
      if (!err) {
        res.send("successful patch the data");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req,res){
    Article.deleteOne({title:req.params.searchTitle},function(err){
      if (!err) {
        res.send("successful delete the data");
      } else {
        res.send(err);
      }
    });
  });


app.listen(3000, function() {
  console.log("Start the server");
});
