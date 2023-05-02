import express from "express";
import cors from "cors";
import mariadb, {Pool} from "mariadb";
//import {MariaWrapper} from "./MariaWrapper";
//import {SqlWrapper} from "./SqlWrapper";

import {Orm} from "./orm";
import {Options} from "sequelize";

function getConfiguredApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    return app;
}

export const app = getConfiguredApp();

/*
const pool: Pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    port: 3307,
    connectionLimit: 5
});
*/

// TODO: Injicera MariaWrapper, mend sin pool.
// const sqlWrapper: SqlWrapper = new MariaWrapper(pool);

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
interface Country extends NodeJS.ReadableStream {
    name: string,
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

    function getMembersOrm(): (req, res) => Promise<void> {
        return async (req, res) => {
            orm.findMembers()
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }


/*    function getWines() {
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
    }*/

    function getWinesOrm(): (req, res) => Promise<void> {
        return async (req, res) => {
            orm.findWines()
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }


    function getGrapesOrm(): (req, res) => Promise<void> {

        return async (req, res) => {
            orm.findGrapes()
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }

    function getCountriesOrm(): (req, res) => Promise<void> {

        return async (req, res) => {
            orm.findCountries()
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }

    function getAllTastingsOrm(): (req, res) => Promise<void> {

        return async (req, res) => {
            orm.findTastings()
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }

    function getTastingOrm(): (req, res) => Promise<void> {

        return async (req, res) => {
            console.log("get tasting with id=", req.params.id);
            orm.getTasting(req.params.id)
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }



    function postGrapeOrm(): (req, res) => void {

        return async (req, res) => {

            const grape: Grape = req.body;

            orm.postGrape(grape)
                .then(() => res.status(201).json("postGrapeOrm called!"))
                .catch(e => console.error(e));

        };
    }


    function postCountriesOrm(): (req, res) => void {

        return async (req, res) => {

            const country: Country = req.body;

            orm.postCountry(country)
                .then(() => res.status(201).json("postCountriesOrm called!"))
                .catch(e => console.error(e));

        };
    }

    function postMemberOrm(): (req, res) => void {

        return async (req, res) => {
            const member: Member = req.body;
            orm.postMember(member)
                .then(() => res.status(201).json("postMemberOrm called!"))
                .catch(e => console.error(e));

        };
    }

    function deleteGrapeByNameOrm() {

        return async (req, res) => {
            const name = req.params.name;

            orm.delGrape(name)
                .then(() => res.status(200).json("delGrapeByIdOrm called!"))
                .catch(e => console.error(e));

        };
    }

    function patchGrapeOrm(): (req, res) => void {

        return async (req, res) => {
            const {from, to} = req.body;

            orm.patchGrape(from, to)
                .then(() => res.status(200).json("patchGrapeOrm called!"))
                .catch(e => console.error(e));
        };
    }


    router.get('/api/v1/members', getMembersOrm());
    router.post('/api/v1/members', postMemberOrm());

    router.get('/api/v1/wines', getWinesOrm());
    router.get('/api/v1/winesOrm', getWinesOrm());

    router.get('/api/v1/vinprovning/:id', getTastingOrm());
    router.get('/api/v1/vinprovning/', getAllTastingsOrm());

    router.get('/api/v1/grapes', getGrapesOrm());
    router.post('/api/v1/grapes', postGrapeOrm());
    router.patch('/api/v1/grapes', patchGrapeOrm());
    router.delete('/api/v1/grapes/:name', deleteGrapeByNameOrm());

    router.get('/api/v1/countries', getCountriesOrm());
    router.post('/api/v1/countries', postCountriesOrm());

}

setupEndpoints(app);



