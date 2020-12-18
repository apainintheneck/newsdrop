const express = require("express");
const pool = require("./dbPool.js");
const url = require('url');

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

app.get("/edit", function(req, res){
    res.render("edit");
}); //"/edit"
app.get("/reddit", function(req, res){
    res.render("reddit");
});//"/"

app.get("/userPosts", function(req, res){
    res.render("userPosts");
});//"/userPosts"

//Post route to receive form data from route "/add".
app.post("/add", function(req, res){
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
            if(tags){
                addTags(rows.insertId, tags);
            }
            //function call to get baseUrl and add to baseUrls table
            addBase(req.body.url);
            
            res.render("add-success", {"title": req.body.title, "type": req.body.type, "url": req.body.url, "description": req.body.description, "tags": tags});
        }
    });
        
}); //"/add"

//Post route to receive form data from route "/edit".
app.post("/edit", function(req, res){
    //Create sql string and param array.
    let sql = "UPDATE posts SET title = ?, description = ? WHERE url = ?";
    let sqlParams = [req.body.title, req.body.description, req.body.url];
    
    //Query database to insert post.
    pool.query(sql, sqlParams, function (err, rows){
        if(err) { //If there is a sql error, handle it immediately.
            throw err;
        } else { //If there are no errors, add tags to db and display successfully added page.
            res.render("edit-success", {"title": req.body.title, "url": req.body.url, "description": req.body.description});
        }
    });
    
}); //"/edit"

//local api to pull from user posts database
app.get("/api/getPosts", function(req, res){
    let sql = "SELECT * FROM posts";
    let sqlParams = [];
    let searchTerm;
    
    switch(req.query.action){
        case "all":     sql = sql + " ORDER BY datetime DESC LIMIT 20";
                        break;
        case "url":     sql = sql + " WHERE url=?";
                        sqlParams.push(req.query.url);
                        break;
        case "search":  
                        if(!req.query.searchterm) {
                            searchTerm = "";
                        } else {
                            searchTerm = req.query.searchterm;
                        }
                        sql = sql + " WHERE LOWER(title) LIKE '%"+searchTerm+"%'";
                        if(req.query.sort == "title") {
                            sql = sql + " ORDER BY title ASC LIMIT 20";
                        }
                        if(req.query.sort == "datetime") {
                            sql = sql + " ORDER BY datetime DESC LIMIT 20";
                        }
                        break;
    }
    
    pool.query(sql, sqlParams, function (err, rows, fields) {
        if (err) throw err;
        // console.log(rows); //testing
        res.send(rows);//sends data to display function as "row"
    });
});

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
//function called by the /add route to create a base url and add it to the database along with a count
function addBase(initialUrl){
    var adr = initialUrl;
    //parses the url into easily accessible portions
    var q = url.parse(adr, true);
    //strips off all but the base Url
    let baseUrl = q.host

    //load the baseUrl into a parameter array
    let sqlParams = [];
    sqlParams.push(baseUrl);
    
    let sql = "INSERT INTO baseUrls (url, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count + 1";

    pool.query(sql, sqlParams, function (err){ if(err) console.log(err); 
    });
}