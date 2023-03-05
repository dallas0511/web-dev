const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {cd
  var nameOfCity = req.body.typeCity;

  const appid = "f95e47712b6aaffa12ffb39e268e4dea"
  const query = req.body.typeCity;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appid+"&unit="+unit;

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherdata = JSON.parse(data);
      const temp = weatherdata.main.temp;
      const icon = weatherdata.weather[0].icon;
      const imgurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      const weather = weatherdata.weather[0].main;
      res.write("<h1>Here is the " + query + " weather DataBase</h1>");
      res.write("Current Tempture is " + temp + "<br>");
      res.write("The weather is <img src =" + imgurl + ">");
      res.send();
    });

  });
});

app.listen(2000, function(req, res) {
  console.log("Port: 2000 Started");
});
