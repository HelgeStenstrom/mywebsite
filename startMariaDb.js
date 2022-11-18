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
        await conn.end();
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
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});

app.get('/grapes', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = `
            select w.name, w.color, d.sv as farg
            from hartappat.grapes w
                     join hartappat.dictionary d
                          on w.color = d.en;
        `;
        let promise = conn.query(sql);
        promise.then((x) => res.json(x));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});

function postGrapeHandler() {
    // TODO: Check POST for code at work
    return (req, res) => {
        //console.log("postGrapeHandler called", req.query);
        try {
            insertGrape(req.query.name, req.query.color);
            res.status(201).send("postGrapeHandler called");
        } catch (e) {
            res.status(418).send("unacceptable Wine/color combo");
        }
        // //console.log("result: ", res);
        // if (res.sdfsd) {
        //     res.status(201).send("postGrapeHandler called");
        // } else {
        //     res.status(418).send("unacceptable Wine/color combo");
        // }
    };
}

async function insertGrape(grapeName, grapeColor) {
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = "insert into hartappat.grapes (name, color) value (?, ?);"
        const res = await conn.query(sql, [grapeName, grapeColor]);

        console.log("InsertGrape resonse: ",  res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
        return res;

    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

app.post('/g2',  postGrapeHandler());

app.post('/grapes', async (req, res) => {
    //res.send("PUT Request Called")
    let conn;
    try {
        conn = await pool.getConnection();
        const grapeName = 'Name';
        const grapeColor = 'green';
        const sql = `insert into hartappat.grapes (name, color) value (${grapeName}, ${grapeColor});`;

        let promise = conn.query(sql);

        promise.then((x) => res.json(x));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});

app.delete('/grapes/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = `
            select w.name, w.color, d.sv as farg
            from hartappat.grapes w
                     join hartappat.dictionary d
                          on w.color = d.en;
        `;
        let promise = conn.query(sql);
        promise.then((x) => res.json(x));
        await conn.end();
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
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});



app.listen(3000);