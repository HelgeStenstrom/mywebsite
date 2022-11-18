import express from "express";

import cors from "cors";
import mariadb, {Pool, PoolConnection} from "mariadb";

const app = express();
app.use(cors());
const pool: Pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    port: 3307,
    connectionLimit: 5
});

app.get('/members', async (req, res) => {
    let conn: PoolConnection;
    try {
        conn = await pool.getConnection();
        const sql = `select *from hartappat.members`;
        const promise: Promise<any> = conn.query(sql);
        promise.then((x) => res.json(x));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});

app.get('/wines', async (req, res) => {
    let conn: PoolConnection;
    try {
        conn = await pool.getConnection();
        const sql = `
            select w.Name as name, c.name as country, wt.sv as vinkategori
            from hartappat.wines w
                     join hartappat.winetypes wt
                          on w.winetype = wt.id
                     join hartappat.countries c
                          on w.country = c.id;
        `;
        const promise: Promise<any> = conn.query(sql);
        promise.then((x) => res.json(x));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});

app.get('/grapes', async (req, res) => {
    let conn: PoolConnection;
    try {
        conn = await pool.getConnection();
        const sql = `
            select g.name, g.color
            from hartappat.grapes g;
        `;
        const promise = conn.query(sql);
        promise.then((x) => res.json(x));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});

function postGrapeHandler(): (req, res) => void {
    // TODO: Check POST for code at work
    return (req, res) => {
        try {
            insertGrape(req.query.name, req.query.color);
            res.status(201).send("postGrapeHandler called");
        } catch (e) {
            res.status(418).send("unacceptable Wine/color combo");
        }
    };
}

async function insertGrape(grapeName, grapeColor): Promise<any> {
    let conn: PoolConnection;
    try {
        conn = await pool.getConnection();
        const sql = "insert into hartappat.grapes (name, color) value (?, ?);"
        const res = await conn.query(sql, [grapeName, grapeColor]);

        console.log("InsertGrape response: ",  res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
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
    let conn: PoolConnection;
    try {
        conn = await pool.getConnection();
        const grapeName = 'Name';
        const grapeColor = 'green';
        const sql = `insert into hartappat.grapes (name, color) value (${grapeName}, ${grapeColor});`;

        const promise: Promise<any> = conn.query(sql);

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
        const sql = `
            select w.name, w.color, d.sv as farg
            from hartappat.grapes w
                     join hartappat.dictionary d
                          on w.color = d.en;
        `;
        const promise = conn.query(sql);
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
        const promise = conn.query('select * from hartappat.countries');
        promise.then((x) => res.json(x));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});



app.listen(3000);