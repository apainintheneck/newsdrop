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

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running..."); 
});