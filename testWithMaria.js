const express = require("express");
const app = express();


const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    port: 3307,
    connectionLimit: 5});

/*pool.getConnection()
    .then(conn => {
        conn.query("SELECT 1 as val")
            .then((rows) => {
                console.log(rows); //[ {val: 1}, meta: ... ]
                return conn.query("INSERT INTO medlemmar value ('id','Förnamn', 'Efternamn')",
                    [1, "Helge", "Stenström"]);
            })
            .then((res) => {
                console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
                conn.end();
            })
            .catch(err => {
                //handle error
                conn.end();
            })
    }).catch(err => {
    //not connected
});*/

app.get('/members', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let promise = conn.query('select * from hartappat.medlemmar');
        promise.then((x) => res.json(x));
    } catch (e) {
        console.error(e);
    }

})

app.listen(3000);