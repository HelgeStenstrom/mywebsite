import express from "express";
import cors from "cors";
import mariadb, {Pool, PoolConnection} from "mariadb";

function getConfiguredApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.listen(3000);
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

function setupEndpoints(router) {

    function getMembers() {
        return async (req, res) => {
            await innerGetMembers(req, res);
        };
    }

    async function innerGetMembers(req, res) {
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
    }

    function getWines() {
        return async (req, res) => {
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
        };
    }

    function getGrapes() {
        return async (req, res) => {
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
        };
    }

    router.get('/membersX', getMembers());
    router.get('/members', innerGetMembers);
    router.get('/wines', getWines());
    router.get('/grapes', getGrapes());
    router.post('/g2', postGrapeHandler());

    function postGrapeHandler(): (req, res) => void {
        // TODO: Check POST for code at work
        return (req, res) => {
            console.log("postGrapeHandler(): ", req.query.name, req.query.color);
            console.log("postGrapeHandler() body: ", req.body);
            insertGrape(req.query.name, req.query.color)
                .then(() => res.status(201).send("postGrapeHandler called"))
                .catch(() => {
                    return res.status(418).send("It failed");
                });
        };
    }


    async function insertGrape(grapeName, grapeColor): Promise<unknown> {
        console.log("insertGrape: ", grapeName, grapeColor);
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

    router.post('/g3', async (req, res): Promise<void> => {
        console.log("post g3 req: ", req);
        console.log("post g3 req.query: ", req.query);
        console.log("post g3 res: ", res);
        let conn: PoolConnection;
        try{
            conn = await pool.getConnection();
        } finally {
            await conn.end();
        }

    });

    function gBodyMethod() {
        return async (req, res) => {
            console.log("/gbody req", req);
            //console.log("/gbody res", res);
            console.log("/gbody req.body", req.body);
            console.log("/gbody req.params", req.params);

            res.status(200).send("gBodyMethod sent this");
        };
    }

    router.post('/gbody', gBodyMethod())

    router.put('/g3', async (req, res) => {
        console.log("put g3 req: ", req);
        console.log("put g3 req.query: ", req.query);
        console.log("put g3 res: ", res);
    });

    router.post('/grapes', async (req, res) => {
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

    router.delete('/grapes/:id', async (req, res) => {
        const id = req.params.id;
        console.log("Deleting: ", id);
        let conn;
        try {
            conn = await pool.getConnection();
            const sql = `
                delete
                from hartappat.grapes
                where id = ${id};
            `;
            console.log(sql);
            const promise = conn.query(sql);
            promise.then((x) => {
                const affectedRows = x.affectedRows;
                if (affectedRows) {
                    return res.status(200).send("Deletion done");
                } else {
                    return res.status(418).send("Nothing deleted");
                }
            });
        } catch (e) {
            console.error(e);
        } finally {
            await conn.end();
        }

    });

    router.get('/countries', async (req, res) => {
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



