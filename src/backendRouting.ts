import express from "express";
import cors from "cors";

import {Orm} from "./orm";
import {EndpointHandlers} from "./endpointHandlers";

function getConfiguredApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    return app;
}

export const app = getConfiguredApp();

export interface Member extends NodeJS.ReadableStream {
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

export function setupEndpoints(router, sequelizeDbOptions) {


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



    function postGrape(): (req, res) => void {

        return async (req, res) => {

            const grape: Grape = req.body;

            orm.postGrape(grape)
                .then(() => res.status(201).json("postGrape called!"))
                .catch(e => console.error(e));

        };
    }


    function postCountries(): (req, res) => void {

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

    function patchGrape(): (req, res) => void {

        return async (req, res) => {
            const {from, to} = req.body;

            orm.patchGrape(from, to)
                .then(() => res.status(200).json("patchGrape called!"))
                .catch(e => console.error(e));
        };
    }


    router.get('/api/v1/members', endpointHandlers.getMembers());
    router.post('/api/v1/members', endpointHandlers.postMember());

    router.get('/api/v1/wines', endpointHandlers.getWines());

    router.get('/api/v1/vinprovning/:id', getTasting());
    router.get('/api/v1/vinprovning/', getAllTastings());

    router.get('/api/v1/grapes', getGrapes());
    router.post('/api/v1/grapes', postGrape());
    router.patch('/api/v1/grapes', patchGrape());
    router.delete('/api/v1/grapes/:name', deleteGrapeByName());

    router.get('/api/v1/countries', getCountries());
    router.post('/api/v1/countries', postCountries());

}



