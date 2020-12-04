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
    console.log(req.body); //For testing.
    
    let sql;
    let sqlParams;
    
    sql = "INSERT INTO posts (title, type, url, description) VALUES (?,?,?,?)";
    sqlParams = [req.body.title, req.body.type, req.body.url, req.body.description];
    
    pool.query(sql, sqlParams, function (err, rows, fields){
        if (err) throw err;
        console.log(rows); 
    });

    res.render("added");
    
});

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running..."); 
});