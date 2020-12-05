const express = require("express");
const fetch = require("node-fetch");
const pool = require("./dbPool.js");

const app = express();

//Used to parse the body of a post request.
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

//---routes---
app.get("/", function(req, res){
    res.render("index");
});//"/"

app.get("/add", function(req, res){
    res.render("add");
}); //"/add"

//Post route to receive form data from route "/add".
app.post("/added", function(req, res){
    //Parse tag string to remove spaces and duplicates and get a tag array.
    let tags;
    if(req.body.tags){
        tags = req.body.tags.split(" ").filter(Boolean); //Use filter() to remove empty strings "" resulting from split() method.
        tags = [...new Set(tags)]; //Use the conversion to a set to remove duplicates.
    }
    
    //Create sql string and param array.
    let sql = "INSERT INTO posts (title, type, url, description) VALUES (?,?,?,?)";
    let sqlParams = [req.body.title, req.body.type, req.body.url, req.body.description];
    
    //Query database to insert post.
    pool.query(sql, sqlParams, function (err, rows){
        if(err) { //If there is a sql error, handle it immediately.
            //Display if it is a duplicate entry.
            if(err.code == "ER_DUP_ENTRY" || err.errno == 1062){
                res.render("add-error", {"url": req.body.url, "msg": "The following link has already been posted before."});
            //Generic error message.
            } else {
                res.render("add-error", {"url": req.body.url, "msg": "Error: Unable to access database."});
            }
        } else { //If there are no errors, add tags to db and display successfully added page.
            if(tags) addTags(rows.insertId, tags);
            
            res.render("add-success", {"title": req.body.title, "type": req.body.type, "url": req.body.url, "description": req.body.description, "tags": tags});
        }
    });
        
}); //"/added"

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running..."); 
});


//---functions---
//Add tags to database based upon postId.
function addTags(postId, tags){
    //First, create sql string and param array.
    let sql = "INSERT INTO tags (post_ID, tag) VALUES";
    let sqlParams = [];
    
    for(let i = 0; i < tags.length; i++){
        sql = sql.concat(" (?,?)");
        if(i + 1 < tags.length) sql = sql.concat(",");
        sqlParams.push(postId, tags[i]);
    }
    
    sql = sql.concat(";");
    
    //Second, make sql query to insert tags.
    //Tags are of low importance so errors will just be logged.
    pool.query(sql, sqlParams, function (err){ if(err) console.log(err); });
}