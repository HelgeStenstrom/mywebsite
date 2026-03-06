import express, {Express} from "express";
import cors from "cors";

import {Orm} from "./orm";
import {GrapeHandlers} from "./handlers/grape.handlers";
import {MemberHandlers} from "./handlers/member.handlers";
import {TastingHandlers} from "./handlers/tasting.handlers";
import {CountryHandlers} from "./handlers/country.handlers";
import {WineTypeHandlers} from "./handlers/wine-type.handlers";
import {WineHandlers} from "./handlers/wine.handlers";

function getConfiguredApp(): Express {
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    return app;
}

export const app: Express = getConfiguredApp();


export function setupEndpoints(router: Express, orm: Orm) {

    const grapeHandlers = new GrapeHandlers(orm);
    const memberHandlers = new MemberHandlers(orm);
    const tastingHandlers = new TastingHandlers(orm);
    const countryHandlers = new CountryHandlers(orm);
    const wineTypeHandlers = new WineTypeHandlers(orm);
    const wineHandlers = new WineHandlers(orm);


    router.get('/api/v1/countries', countryHandlers.getCountries());
    router.post('/api/v1/countries', countryHandlers.postCountries());
    router.delete('/api/v1/countries/:id', countryHandlers.deleteCountryById());

    router.get('/api/v1/grapes', grapeHandlers.getAll());
    router.post('/api/v1/grapes', grapeHandlers.create());

    router.delete('/api/v1/grapes/:id', grapeHandlers.deleteGrapeById());
    router.get('/api/v1/grapes/:id', grapeHandlers.getGrapeById());
    router.patch('/api/v1/grapes/:id', grapeHandlers.patchGrape());

    router.get('/api/v1/members', memberHandlers.getMembers());
    router.post('/api/v1/members', memberHandlers.postMember());

    router.get('/api/v1/tastings/:id', tastingHandlers.getTasting());
    router.get('/api/v1/tastings/', tastingHandlers.getTastings());
    router.post('/api/v1/tastings/', tastingHandlers.postTasting());

    router.get('/api/v1/wines', wineHandlers.getWines());
    router.post('/api/v1/wines', wineHandlers.postWine());

    router.delete('/api/v1/wines/:id', wineHandlers.deleteWineById());

    router.post('/api/v1/wine-types', wineTypeHandlers.postWineType());
    router.get('/api/v1/wine-types', wineTypeHandlers.getWineTypes());
    router.delete('/api/v1/wine-types/:id', wineTypeHandlers.deleteWineTypeById());

}
