import express from "express";
import cors from "cors";
import mariadb, {Pool} from "mariadb";
import {MariaWrapper} from "./MariaWrapper";
import {SqlWrapper} from "./SqlWrapper";

import {Orm} from "./orm";
import {Options} from "sequelize";

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

    const mariaDbOptions : Options = {
        dialect: 'mariadb',
        dialectOptions: {
            user: 'root',
            // password: 'root1234',
            // host: 'localhost',
            port: 3307,
            connectionLimit: 5
            // Your mariadb options here
            // connectTimeout: 1000
        }
    };

    const orm  = new Orm('hartappat', 'root', 'root1234', mariaDbOptions);

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

    function getGrapesOrm(): (req, res) => Promise<void> {

        return async (req, res) => {

            try {

                orm.findGrapes()
                    .then((x) => res.json(x));
                await orm.end();
            } catch (e) {
                console.error(e);
            }
        };
    }


    function postGrapeHandlerOrm(): (req, res) => void {

        return async (req, res) => {

            const body: Grape = req.body;

            try{
                orm.postGrape(body)
                    .then(() => res.status(201).json("postGrapeHandlerOrm called!"));
                await orm.end()
            }catch (e) {
                console.error(e);
            }

        };
    }

    function deleteGrapeByNameOrm() {

        return async (req, res) => {
            const name = req.params.name;
            try {
                orm.delGrape(name)
                    .then(() => res.status(200).json("delGrapeByIdOrm called!"));
                await orm.end();
            } catch (e){
                console.error(e);
            }
        };
    }

    function patchGrapeHandlerOrm(): (req, res) => void {

        return async (req, res) => {
            const {from, to} = req.body;

            try {
                orm.patchGrape(from, to)
                    .then(() => res.status(200).json("patchGrapeHandlerOrm called!"));
                await orm.end();
            } catch (e) {
                console.error(e);
            }

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

    function getTasting() {
        return async (req, res) => {

            const sql = `select *
                         from hartappat.tasting t
                         where t.id = ?`;

            console.log('got a valid id');
            sqlWrapper.query(sql, [+(req.params.id)])
                .then((t) => res.json(t));
            await sqlWrapper.end();
        };
    }

    function getAllTastings() {
        return async (req, res) => {

            const sql = `select *
                         from hartappat.tasting t`;

            console.log('got a valid id');
            sqlWrapper.query(sql)
                .then((t) => res.json(t));
            await sqlWrapper.end();
        };
    }

    router.get('/membersX', getMembers());

    router.get('/api/v1/members', innerGetMembers);

    router.get('/api/v1/wines', getWines());


    router.get('/api/v1/vinprovning/:id', getTasting());
    router.get('/api/v1/vinprovning/', getAllTastings());

    router.get('/api/v1/grapes', getGrapesOrm());
    router.post('/api/v1/grapes', postGrapeHandlerOrm());
    router.patch('/api/v1/grapes', patchGrapeHandlerOrm());
    router.delete('/api/v1/grapes/:name', deleteGrapeByNameOrm());

    router.get('/api/v1/countries', async (req, res) => {
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



