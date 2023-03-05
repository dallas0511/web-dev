const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testDB');

const itemschema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  age: {
    type:Number,
    min:[1,'Must higher than 1, got {VALUE}'],
    max:[10,'Too huge, {VALUE}']
  }
});

const Cat = mongoose.model('Cat', itemschema);

const kitty = new Cat({
  name:"Manchecken",
  age: 6
});

kitty.save().then(console.log("Meow"));

const peopleschema = new mongoose.Schema({
  name:String,
  age:Number,
  preference:String,
  pet:itemschema
});

const Person = mongoose.model("Person",peopleschema);

const person = new Person({
  name:"Josh",
  age:30,
  preference:"Cat",
  pet:kitty
});

person.save();

// Cat.insertMany([kitty,doggy,puppy],function(err){
//   if(err){
//     consol.log("Error happen!!");
//   }else{
//     console.log("Sucess");
//   }
// });

Cat.find(function(err,cats) {

  mongoose.disconnect() ;

  cats.forEach(function(element){
    console.log(element.age);
  });


});
