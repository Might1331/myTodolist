//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://pratap:7897574026@cluster0.2m4hg.mongodb.net/todolistDB",{useNewUrlParser: true});

const itemSchema={
  name: String
};

const Item=mongoose.model("Item",itemSchema);

const item1= new Item({
  name: "Task1"
});
const item2= new Item({
  name: "Task2"
});
const item3=new Item({
  name: "Task3"
});

const defaultItems = [item1,item2,item3];



app.get("/", function(req, res) {
  Item.find({},function(err,foundArr){
    if(foundArr.length==0){
      Item.insertMany(defaultItems,function(err){
        if(err) console.log(err);
        else{
          console.log("Successfully intserted");
        }
      });
      res.redirect("/");
    }
    else res.render("list", {listTitle: "Today", newListItems: foundArr});
  });

});

app.post("/", function(req, res){

  const itemname = req.body.newItem;
  const newItem=new Item({
    name: itemname
  })
  newItem.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const id=req.body.id;
  Item.findOneAndRemove({_id:id},function(err){
    if(err) console.log(err);
    else console.log("Deleted");
  });
  res.redirect("/");
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
