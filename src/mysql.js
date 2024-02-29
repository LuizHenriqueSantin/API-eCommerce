const mysql = require('mysql2');

var connection = mysql.createConnection({
    "user": process.env.USER,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST,
    "port": process.env.PORT
});

exports.connection = connection;