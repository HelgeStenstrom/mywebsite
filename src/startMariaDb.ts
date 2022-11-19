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
        const promise: Promise<Member> = conn.query(sql);
        promise.then((x: Member) => {
            return res.json(x);
        });
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});


interface Member extends NodeJS.ReadableStream {
    id: number,
    givenName: string,
    surname: string
}

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
        const promise: Promise<Wine> = conn.query(sql);
        promise.then((x) => {
            return res.json(x);
        });
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});


interface Wine extends NodeJS.ReadableStream {
    name: string,
    country: string,
    category: string
}

app.get('/grapes', async (req, res) => {
    let conn: PoolConnection;
    try {
        conn = await pool.getConnection();
        const sql = `
            select g.name, g.color
            from hartappat.grapes g;
        `;
        const promise: Promise<Grape> = conn.query(sql);
        promise.then((x) => {
            return res.json(x);
        });
        await conn.end();
    } catch (e) {
        console.error(e);
    }
});

interface Grape extends NodeJS.ReadableStream {
    name: string,
    color: string;
}

function postGrapeHandler(): (req, res) => void {
    // TODO: Check POST for code at work
    return (req, res) => {
        insertGrape(req.query.name, req.query.color)
            .then(() => res.status(201).send("postGrapeHandler called"))
            .catch(() => res.status(418).send("It failed"));
    };
}

async function insertGrape(grapeName, grapeColor): Promise<unknown> {
    let conn: PoolConnection;
    try {
        conn = await pool.getConnection();
        const sql = "insert into hartappat.grapes (name, color) value (?, ?);"
        const res: unknown = await conn.query(sql, [grapeName, grapeColor]);

        console.log("InsertGrape response: ",  res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
        return res;
    } finally {
        if (conn) {
            await conn.end();
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

        const promise: Promise<unknown> = conn.query(sql);

        promise.then((x) => {
            return res.json(x);
        });
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
