const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/blogdb');
const path = require("path");
const { send } = require("process");

var app = express();

// to serve static files
const publicPath = path.join(__dirname,'public/');
app.use(express.static(publicPath));  

// to support URL-encoded bodies OR getting post date
app.use(bodyParser.urlencoded({     
  extended: true
})); 

//setting view engine to ejs
app.set('view engine', 'ejs');

//if we dont specify: by default app.set('views', './views');
app.set('views', './templates'); 

////////////////////////////////////////////////////////////////////////////////////////////////////////
const frontData = {
    title : "",
    page : ""
}
const blogs = [{
    id : 0,
    title : "This is a test Blog",
    body : "This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog.v This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog. This is a test blog.v This is a test blog. This is a test blog. This is a test blog. This is a test blog.",
    author : "Prabhat Panchal",
    createdOn : "02/02/2020",
    like : 20,
    dislike : 11
}]

app.get("/",(req,res) => {
    Blog.find({ author: "Prabhat Panchal" }, function(err, arr) {
        if(err){
            console.log(err);
            res.send("Something broke.")
        } else {
            frontData.title = "Blog Post";
            frontData.page = "home";
            frontData.blogs = arr;
            console.log(arr);
            res.render('blogView', frontData);
        }
    });

    
});
app.get("/myBlogs",(req,res) => {
    var user = "Prabhat Panchal";
    Blog.find({ author: user }, function(err, arr) {
        if(err){
            console.log(err);
            res.send("Something broke.")
        } else {
            frontData.title = user+"'s "+"Post";
            frontData.page = "userBlog";
            frontData.user = "Prabhat Panchal";
            frontData.blogs = arr;
            console.log(arr);
            res.render('blogView', frontData);
        }
    });
});
app.get("/newBlog",(req,res) => {
    frontData.title = "Create Post";
    frontData.page = "newBlog";
    res.render('newBlogForm', frontData);
});

const blogSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true
    },
    body : {
        type:String,
        required:true
    },
    author : {
        type:String,
        required:true
    },
    createdOn : { type: String },
    });
const Blog = mongoose.model("Blog", blogSchema);

app.post("/newBlog",(req,res) => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    const blog = new Blog({
        title : req.body.blogTitle,
        body : req.body.blogText,
        author : "Prabhat Panchal",
        createdOn : today.toLocaleDateString("en-US", options)
    });
    //await blog.validate();
    blog.save(err =>{
        if(err){
            console.log(err);
        } else {
            console.log("Documnet sabed successfully.")
        }
    });
    console.log("saved");
    res.redirect("/myBlogs");
});


app.post("/deleteBlog",(req,res) => {
    Blog.deleteOne({ _id: req.body.blogId }, (arr) =>{
        res.redirect("/myBlogs");
    });
});

app.post("/contactForm",(req,res) => {
    res.redirect("/");
});

app.get("/contactUs",(req,res) => {
    frontData.title = "Contact Us";
    frontData.page = "contactUs";
    res.render('contactUs', frontData);
});
app.get("/aboutUs",(req,res) => {
    frontData.title = "About Us";
    frontData.page = "aboutUs";
    res.render('aboutUs', frontData);
});

app.listen(3000,() => console.log("Server started at port 3000..."));