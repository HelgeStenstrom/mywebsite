const express = require("express");
const app = express()

// From https://expressjs.com/en/guide/database-integration.html#mysql
const mysql = require("mysql");
//const mysql = require("mariadb");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'hartappat'
});

connection.connect();
connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
    if (err) throw err

    console.log('The solution is: ', rows[0].solution)
});

connection.end();

app.get('/', (req, res, next) => {
    res.json({meddelande: "fel?"});
    console.log('/: ', req);
});


app.get('/members', (req, res, next) => {
    res.json({meddelande: "medlemmar"});
    console.log('/members: ');
});


app.listen(3000);
