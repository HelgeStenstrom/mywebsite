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

    function postGrapeHandler(): (req, res) => void {
        // TODO: Check POST for code at work
        return (req, res) => {
            //console.log("postGrapeHandler(): ", req.query.name, req.query.color);
            const body: any = req.body;
            console.log("postGrapeHandler() body: ", req.body);
            insertGrape(body.name, body.color)
                .then(() => res.status(201).json("postGrapeHandler called"))
                .catch(() => {
                    return res.status(418).json("It failed");
                });
        };
    }

    function addGrapeV1() {
        return async (req, res) => {
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

    function printReqAndRes(message: string): (req, res) => Promise<void> {
        return async (req, res): Promise<void> => {
            console.log(`${message} req: `, req);
            console.log(`${message} req.query: `, req.query);
            console.log(`${message} req.params: `, req.params);
            console.log(`${message} res: `, res);
            console.log(`${message} req.body: `, req.body);
            res.status(200).json(`${message}, ${req.query.name}, ${req.query.color}`);

        };
    }
    router.get('/membersX', getMembers());

    router.get('/members', innerGetMembers);


    router.get('/wines', getWines());

    router.get('/grapes', getGrapes());

    router.post('/g2', postGrapeHandler());

    router.post('/g3', printReqAndRes('post /g3'));
    router.put('/g3', printReqAndRes("put /g3"));

    router.post('/gbody', printReqAndRes("post /gbody"))

    router.post('/grapes', addGrapeV1());

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



