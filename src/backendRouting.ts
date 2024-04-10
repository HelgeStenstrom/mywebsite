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


export function setupEndpoints(router: Express, sequelizeDbOptions) {


    const orm  = new Orm('hartappat', 'root', 'root1234', sequelizeDbOptions);

    const endpointHandlers = new EndpointHandlers(orm);


    router.get('/api/v1/countries', endpointHandlers.getCountries());
    router.post('/api/v1/countries', endpointHandlers.postCountries());

    router.get('/api/v1/grapes', endpointHandlers.getGrapes());
    router.post('/api/v1/grapes', endpointHandlers.postGrape());
    router.patch('/api/v1/grapes', endpointHandlers.patchGrape());

    router.delete('/api/v1/grapes/:id', endpointHandlers.deleteGrapeById());
    router.get('/api/v1/grapes/:id', endpointHandlers.getGrapeById());

    router.get('/api/v1/members', endpointHandlers.getMembers());
    router.post('/api/v1/members', endpointHandlers.postMember());

    router.get('/api/v1/tasting/:id', endpointHandlers.getTasting());
    router.get('/api/v1/tasting/', endpointHandlers.getAllTastings());

    router.get('/api/v1/wines', endpointHandlers.getWines());
    router.post('/api/v1/wines', endpointHandlers.postWine());

    router.delete('/api/v1/wines/:id', endpointHandlers.deleteWineById());

}
