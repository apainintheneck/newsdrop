const express = require("express");
const app = express();
const fetch = require("node-fetch");
const pool = require("./dbPool.js");

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get("/", function(req, res){
    res.render("index");
});


app.get("/userlinks", function(req, res){
    res.render("userlinks");
});

app.get("/api/getUserFavorites", function(req, res){
  let sql = "SELECT * FROM posts";
  pool.query(sql, function (err, rows, fields) {
    
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });
    
});

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running..."); 
});