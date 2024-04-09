import express, { Express } from "express";
import cors from "cors";

import { Orm } from "./orm";
import { EndpointHandlers } from "./endpointHandlers";

function getConfiguredApp(): Express {
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    return app;
}

export const app: Express = getConfiguredApp();

export interface Member extends NodeJS.ReadableStream {
    id: number,
    givenName: string,
    surname: string
}

interface Grape extends NodeJS.ReadableStream {
    name: string,
    color: string;
}
interface Country extends NodeJS.ReadableStream {
    name: string,
}

export function setupEndpoints(router: Express, sequelizeDbOptions) {


    const orm  = new Orm('hartappat', 'root', 'root1234', sequelizeDbOptions);

    const endpointHandlers = new EndpointHandlers(orm);


    function getGrapes(): (req, res) => Promise<void> {

        return async (req, res) => {
            thenJson(orm.findGrapes(), res);
        };
    }


    function getCountries(): (req, res) => Promise<void> {

        return async (req, res) => {
            thenJson(orm.findCountries(), res);
        };
    }

    function getAllTastings(): (req, res) => Promise<void> {

        return async (req, res) => {
            thenJson(orm.findTastings(), res);
        };
    }

    function thenJson(promise: Promise<object[]>, res) {
        promise
            .then((x) => res.json(x))
            .catch(e => console.error(e));
    }

    function getTasting(): (req, res) => Promise<void> {

        return async (req, res) => {
            console.log("get tasting with id=", req.params.id);
            orm.getTasting(req.params.id)
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }



    function postGrape(): (req, res) => Promise<void> {

        return async (req, res) => {

            const grape: Grape = req.body;

            orm.postGrape(grape)
                .then((response) => res.status(201).json(response))
                .catch(e => console.error(e));

        };
    }


    function postCountries(): (req, res) => Promise<void>  {

        return async (req, res) => {

            const country: Country = req.body;

            orm.postCountry(country)
                .then(() => res.status(201).json("postCountries called!"))
                .catch(e => console.error(e));

        };
    }

    function deleteGrapeByName() {

        return async (req, res) => {
            const name = req.params.name;

            orm.delGrape(name)
                .then(() => res.status(200).json("deleteGrapeByName called!"))
                .catch(e => console.error(e));

        };
    }

    function patchGrape(): (req, res) => Promise<void>  {

        return async (req, res) => {
            const {from, to} = req.body;

            orm.patchGrapeByNameAndColor(from, to)
                .then(() => res.status(200).json("patchGrape called!"))
                .catch(e => console.error(e));
        };
    }

    function getGrapeById() {

        return async (req, res) => {
            orm.getGrape(req.params.id)
                .then((grape) => {
                    if (grape)
                        return res.status(200).json(grape);
                    else
                        return res.status(404).json({ error: 'Grape not found' });
                })
                .catch(e => console.error(e));
            // TODO: Consider variant of return res.status(500).json({ error: 'Internal Server Error' })

        };
    }


    router.get('/api/v1/countries', getCountries());
    router.post('/api/v1/countries', postCountries());

    router.get('/api/v1/grapes', getGrapes());
    router.post('/api/v1/grapes', postGrape());
    router.patch('/api/v1/grapes', patchGrape());
    router.delete('/api/v1/grapes/:name', deleteGrapeByName());
    router.get('/api/v1/grapes/:id', getGrapeById());

    router.get('/api/v1/members', endpointHandlers.getMembers());
    router.post('/api/v1/members', endpointHandlers.postMember());

    router.get('/api/v1/tasting/:id', getTasting());
    router.get('/api/v1/tasting/', getAllTastings());

    router.get('/api/v1/wines', endpointHandlers.getWines());
    router.post('/api/v1/wines', endpointHandlers.postWine());



}



