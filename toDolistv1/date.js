module.exports.getData = getDate;

function getDate() {

  var today = new Date();
  var option = {
    day: "numeric",
    weekday: "long",
    month: "long",
  };
  return  today.toLocaleDateString("en-us", option);

};


module.exports.getDay = getDay;
function getDay() {

  var today = new Date();
  var option = {

    weekday: "long",

  };
  return  today.toLocaleDateString("en-us", option);

};
