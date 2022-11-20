import express from "express";
import cors from "cors";
import mariadb, {Pool, PoolConnection} from "mariadb";

function getConfiguredApp() {
    const app = express();
    app.use(cors());
    app.listen(3000);
    app.use(express.json());
    return app;
}

const app = getConfiguredApp();

const pool: Pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    port: 3307,
    connectionLimit: 5
});



interface Member extends NodeJS.ReadableStream {
    id: number,
    givenName: string,
    surname: string
}
interface Wine extends NodeJS.ReadableStream {
    name: string,
    country: string,
    category: string
}
interface Grape extends NodeJS.ReadableStream {
    name: string,
    color: string;
}

function setupEndpoints(app) {
    app.get('/members', async (req, res) => {
        let conn: PoolConnection;
        try {
            conn = await pool.getConnection();
            const sql = `select *
                         from hartappat.members`;
            const promise: Promise<Member> = conn.query(sql);
            promise.then((x: Member) => {
                return res.json(x);
            });
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
                select w.Name as name, c.name as country, wt.sv as category, w.systembolaget as systembolaget
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
    app.post('/g2', postGrapeHandler());

    function postGrapeHandler(): (req, res) => void {
        // TODO: Check POST for code at work
        return (req, res) => {
            console.log("postGrapeHandler(): ", req.query.name, req.query.color);
            console.log(req.body);
            insertGrape(req.query.name, req.query.color)
                .then(() => res.status(201).send("postGrapeHandler called"))
                .catch(() => {
                    return res.status(418).send("It failed");
                });
        };
    }

    async function insertGrape(grapeName, grapeColor): Promise<unknown> {
        let conn: PoolConnection;
        try {
            conn = await pool.getConnection();
            const sql = "insert into hartappat.grapes (name, color) value (?, ?);"
            const res: unknown = await conn.query(sql, [grapeName, grapeColor]);

            console.log("InsertGrape response: ", res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
            return res;
        } finally {
            if (conn) {
                await conn.end();
            }
        }
    }

    app.post('/g3', async (req, res): Promise<void> => {
        console.log("post g3 req: ", req);
        console.log("post g3 req.query: ", req.query);
        console.log("post g3 res: ", res);
    });

    app.put('/g3', async (req, res) => {
        console.log("put g3 req: ", req);
        console.log("put g3 req.query: ", req.query);
        console.log("put g3 res: ", res);
    });

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
}

setupEndpoints(app);



