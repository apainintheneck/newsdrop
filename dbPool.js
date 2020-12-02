const mysql = require('mysql');

const pool = mysql.createPool({ 
    connectionLimit: 10,
    host: "de1tmi3t63foh7fa.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "f1m9vwrbgen0ox6j",
    password: "mbs198qklr60b6n7",
    database: "cslmbxgxzt3gjvvx"
});

module.exports = pool;