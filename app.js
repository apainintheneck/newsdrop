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

app.post("/added", function(req, res){
    console.log(req.body); //For testing
    
    let sql;
    let sqlParams;
    
    sql = "INSERT INTO posts (title, type, url, description) VALUES (?,?,?,?)";
    sqlParams = [req.body.title, req.body.type, req.body.url, req.body.description];
    
    // Fix database before you continue testing adding to database.
    // pool.query(sql, sqlParams, function (err, rows, fields){
    //     if (err){
    //         throw err;
    //         res.render("add-error", {"url": req.body.url, "msg": "Error: Unable to contact database."});
    //     } 
        
    //     console.log(rows); //For testing
    //     console.log(fields);
    // });
    
    //Add tags to database.
    
    if(1){ //If post added successfully...
        res.render("add-success", {"siteInfo": req.body});
    } else { //If unable to add post...
        res.render("add-error", {"url": req.body.url, "msg": "The following link has already been posted before."});
    }
    
});

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running..."); 
});