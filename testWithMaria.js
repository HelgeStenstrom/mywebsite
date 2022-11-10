const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    port: 3307,
    connectionLimit: 5
});

app.get('/members', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = `select * from hartappat.members`;
        let promise = conn.query(sql);
        promise.then((x) => res.json(x));
    } catch (e) {
        console.error(e);
    }
});

app.get('/wines', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = `
            select w.Name as name, c.name as country, wt.sv as vinkategori
            from hartappat.wines w
                     join hartappat.winetypes wt
                          on w.winetype = wt.id
                     join hartappat.countries c
                          on w.country = c.id;
        `;
        let promise = conn.query(sql);
        promise.then((x) => res.json(x));
    } catch (e) {
        console.error(e);
    }
});

app.get('/countries', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let promise = conn.query('select * from hartappat.countries');
        promise.then((x) => res.json(x));
    } catch (e) {
        console.error(e);
    }
});

app.listen(3000);