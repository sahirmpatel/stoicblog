var express     = require("express");
var app         = express();
var bodyParser  =  require("body-parser");
var mongoose    = require("mongoose");
var methodoverride = require("method-override");
var expresssanitizer = require("express-sanitizer");
const PORT = process.env.PORT || 5000




mongoose.connect('mongodb+srv://sahirmpatel:sahirmpatel@cluster0-3o1mc.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));


//mongoose configuration
var blogSchema = new mongoose.Schema({
    
    title:String,
    image :String,
    body :String,
    created: {type: Date, default: Date.now}

});

var Blog = mongoose.model("Blog",blogSchema);


app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index",{blogs: blogs});
        }
    })
});

app.get("/",function(req,res){
    res.redirect("/blogs");
 })

//creating new

app.get("/blogs/new",function(req,res){
    res.render("new");
})

app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    })
});

//SHOW
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.send(err);
        } else{
            res.render("showpage",{blog:foundBlog})
        }
    })
})

//EDIT
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.send(err);
        } else{
            res.render("edit",{blog:foundBlog}); 
        }
    })
})

//PUT i.e show edited
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.send(err);
        }
        else{
            res.redirect("/blogs/"+updatedBlog._id);
        }
    })
})

//destroyyy

app.delete("/blogs/:id",function(req,res){
        Blog.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.send(err);
            } else{
                res.redirect("/blogs");
            }
        })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
