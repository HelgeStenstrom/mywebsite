import express from "express";
import cors from "cors";
import mariadb, {Pool} from "mariadb";
import {MariaWrapper} from "./MariaWrapper";
import {SqlWrapper} from "./SqlWrapper";

function getConfiguredApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    return app;
}

export const app = getConfiguredApp();


const pool: Pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    port: 3307,
    connectionLimit: 5
});

// TODO: Injicera MariaWrapper, mend sin pool.
const sqlWrapper: SqlWrapper = new MariaWrapper(pool);

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
        const sql = `select *
                         from hartappat.members`;
        try {
            sqlWrapper.query(sql)
                .then((x: Member) => res.json(x));
            await sqlWrapper.end();
        } catch (e) {
            console.error(e);
        }
    }

    function getWines() {
        return async (req, res) => {
            const sql = `
                select w.Name as name, c.name as country, wt.sv as category, w.systembolaget as systembolaget
                from hartappat.wines w
                         join hartappat.winetypes wt
                              on w.winetype = wt.id
                         join hartappat.countries c
                              on w.country = c.id;
            `;
            try {
                sqlWrapper.query(sql)
                    .then((x: Wine) => res.json(x));
                await sqlWrapper.end();
            } catch (e) {
                console.error(e);
            }
        };
    }

    function getGrapes() {
        return async (req, res) => {
            const sql = `
                select g.name, g.color
                from hartappat.grapes g;
            `;
            try {
                sqlWrapper.query(sql)
                    .then((x: Grape) => res.json(x));
                await sqlWrapper.end();
            } catch (e) {
                console.error(e);
            }
        };
    }

    function postGrapeHandler(): (req, res) => void {
        return (req, res) => {
            const body = req.body;
            insertGrape(body.name, body.color)
                .then(() => res.status(201).json("postGrapeHandler called"))
                .catch(() => {
                    return res.status(418).json("It failed");
                });
        };
    }

    function patchGrapeHandler(): (req, res) => void {
        return (req, res) => {
            const {from, to} = req.body;

            updateGrape(from, to)
                .then(() => res.status(201).json("postGrapeHandler called"))
                .catch(() => {
                    return res.status(400).json(`Updating ${from.name} failed`);
                });
        };
    }
    async function insertGrape(grapeName, grapeColor): Promise<unknown> {
        try {
            const sql = "insert into hartappat.grapes (name, color) value (?, ?);"
            return await sqlWrapper.query(sql, [grapeName, grapeColor]);
        } finally {
            await sqlWrapper.end();
        }
    }


    async function updateGrape(from, to): Promise<unknown> {
        const sql = `update hartappat.grapes
                         set name='${to.name}',
                             color='${to.color}'
                         where name = '${from.name}';`;
        try {
            return await sqlWrapper.query(sql);
        } finally {
            await sqlWrapper.end();
        }
    }

    router.get('/membersX', getMembers());

    router.get('/members', innerGetMembers);

    router.get('/wines', getWines());

    router.get('/grapes', getGrapes());

    router.get('/api/v1/vinprovning/:id', (req, res) => {

        function isValidTastingId() {
            return isNaN(+maybeNumber);
        }

        const maybeNumber = +(req.params.id);

        if ( isValidTastingId()) {
            return res.status(404).send();
        }

        const id: number = req.params.id;
        return res.json({'id': +id});
    });

    router.post('/grapes', postGrapeHandler());
    router.patch('/grapes', patchGrapeHandler());

    router.delete('/grapes/:id', async (req, res) => {
        const id = req.params.id;
        const sql = `
                delete
                from hartappat.grapes
                where name = '${id}';
            `;

        sqlWrapper
            .query(sql)
            .then((x) => {
                const affectedRows = x.affectedRows;
                if (affectedRows) {
                    return res.status(200).json("Deletion done");
                } else {
                    return res.status(418).json("Nothing deleted");
                }
            })
            .then(() => sqlWrapper.end())
            .catch((e) => {
                console.error('An badly handled error happened: ', e);
                sqlWrapper.end();
            });


    });

    router.get('/countries', async (req, res) => {
        const sql = 'select * from hartappat.countries';
        try {
            const promise = sqlWrapper.query(sql);
            promise.then((x) => res.json(x));
            await sqlWrapper.end();
        } catch (e) {
            console.error(e);
        }
    });
}

setupEndpoints(app);



