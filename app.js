const express = require("express");
const fetch = require("node-fetch");
const pool = require("./dbPool.js");

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get("/", function(req, res){
    res.render("index");
});

app.get("/add", function(req, res){
    res.render("add");
});

app.post("/added", async function(req, res){
    console.log(req.body); //For testing
    
    let tags;
    if(req.body.tags){
        tags = req.body.tags.split(" ").filter(Boolean); //Use filter() to remove empty strings "" resulting from split() method.
        tags = [...new Set(tags)]; //Use the conversion to a set to remove duplicates.
    }
    
    let sql;
    let sqlParams;
    
    sql = "INSERT INTO posts (title, type, url, description) VALUES (?,?,?,?)";
    sqlParams = [req.body.title, req.body.type, req.body.url, req.body.description];
    
    await pool.query(sql, sqlParams, function (err, res){
        if(err) {
            if(err.code == "ER_DUP_ENTRY" || err.errno == 1062){
                res.render("add-error", {"url": req.body.url, "msg": "The following link has already been posted before."});
                console.log(err);
            } else {
                res.render("add-error", {"url": req.body.url, "msg": "Error: Unable to access database."});
                console.log(err);
            }
        } else {
            console.log(res);
            let insertID = res.insertID;
            
            //Add tags to database.
            if(tags) addTags(insertID, tags);
            
            res.render("add-success", {"title": req.body.title, "type": req.body.type, "url": req.body.url, "description": req.body.description, "tags": tags});
        }
    });
    
    res.render("add-success", {"title": req.body.title, "type": req.body.type, "url": req.body.url, "description": req.body.description, "tags": tags});
        
});

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running..."); 
});