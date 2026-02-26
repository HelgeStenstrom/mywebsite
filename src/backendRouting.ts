import express, {Express} from "express";
import cors from "cors";

import {Orm} from "./orm";
import {EndpointHandlers} from "./endpointHandlers";
import {GrapeHandlers} from "./handlers/grape.handlers";

function getConfiguredApp(): Express {
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    return app;
}

export const app: Express = getConfiguredApp();


export function setupEndpoints(router: Express, orm: Orm) {


    const endpointHandlers = new EndpointHandlers(orm);
    const grapeHandlers = new GrapeHandlers(orm);


    router.get('/api/v1/countries', endpointHandlers.getCountries());
    router.post('/api/v1/countries', endpointHandlers.postCountries());
    router.delete('/api/v1/countries/:id', endpointHandlers.deleteCountryById());

    router.get('/api/v1/grapes', grapeHandlers.getAll());
    router.post('/api/v1/grapes', grapeHandlers.create());
    router.patch('/api/v1/grapes', grapeHandlers.patchGrape());

    router.delete('/api/v1/grapes/:id', grapeHandlers.deleteGrapeById());
    router.get('/api/v1/grapes/:id', grapeHandlers.getGrapeById());
    router.put('/api/v1/grapes/:id', grapeHandlers.putGrapeById());

    router.get('/api/v1/members', endpointHandlers.getMembers());
    router.post('/api/v1/members', endpointHandlers.postMember());

    router.get('/api/v1/tastings/:id', endpointHandlers.getTasting());
    router.get('/api/v1/tastings/', endpointHandlers.getTastings());
    router.post('/api/v1/tastings/', endpointHandlers.postTasting());

    router.get('/api/v1/wines', endpointHandlers.getWines());
    router.post('/api/v1/wines', endpointHandlers.postWine());

    router.delete('/api/v1/wines/:id', endpointHandlers.deleteWineById());

    router.post('/api/v1/wine-types', endpointHandlers.postWineType());
    router.get('/api/v1/wine-types', endpointHandlers.getWineTypes());
    router.delete('/api/v1/wine-types/:id', endpointHandlers.deleteWineTypeById());

}
