//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Capture your thoughts, ideas, and memories with ease! Daily Journal is your personal space to jot down daily entries, reflect on your day, and track your journey over time. Whether you're recording personal milestones or everyday musings, our platform is designed to provide a smooth and intuitive writing experience and you can compose your journals";
const aboutContent = "Welcome to the Daily Journal Website, your personal space for reflection and organization. Our platform offers a simple yet powerful way to document your thoughts, track daily activities, and capture memorable moments. Our goal is to make journaling easy and accessible, helping you keep your life organized and your thoughts well-documented. Thank you for choosing us to accompany you on your journaling journey!";
const contactContent = "We’d love to hear from you! Whether you have questions, feedback, or need support, feel free to reach out to us.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin-suresh:test123@cluster0.cntihcp.mongodb.net/blogDB');

  const postSchema = {
    title: String,
    content: String
  }; 
  const Post = mongoose.model("Post", postSchema); 

  app.get("/", function(req, res){

    Post.find({}).then(post => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: post
      });
    }).catch(err => {
      if (err) {
        console.log(err);
    }
    });
    
  });

  app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
  });

  app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
  });

  app.get("/compose", function(req, res){
    res.render("compose");
  });

  app.post("/compose", function(req, res){

    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });

    post.save().then(err => {
      if(!err){
        res.redirect("/");
      }
    }).catch(err => {
      if (err) {
        console.log(err);
    }
    });

  });

  app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}).then(post => {
      res.render("post", {

        title: post.title,
   
        content: post.content
   
      })
    }).catch(err => {
      if (err) {
        console.log(err);
    }
    });
  });

  app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });

}
