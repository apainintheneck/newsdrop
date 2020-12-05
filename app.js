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

// app.post("/api/user-posts", function(req, res){
//     console.log(req.body); //For testing
    
//     let sql;
//     let sqlParams;
    
//     sql = "INSERT INTO posts (title, type, url, description) VALUES (?,?,?,?)";
//     sqlParams = [req.body.title, req.body.type, req.body.url, req.body.description];
    
//     // Fix database before you continue testing adding to database.
//     pool.query(sql, sqlParams, function (err){
//         if (err) throw err;
//     });
    
//     // // Add tags to database.
// });

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
    
    try{
        await pool.query(sql, sqlParams, function (err, rows){
            if(err) throw err;
        });
        
        res.render("add-success", {"title": req.body.title, "type": req.body.type, "url": req.body.url, "description": req.body.description, "tags": tags});
    } catch(e) {
        if(e.code == "ER_DUP_ENTRY" || e.errno == 1062){
            res.render("add-error", {"url": req.body.url, "msg": "The following link has already been posted before."});
        } else {
            res.render("add-error", {"url": req.body.url, "msg": "Error: Unable to access the database."});
        }
        console.log(e);
    }

});

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running..."); 
});