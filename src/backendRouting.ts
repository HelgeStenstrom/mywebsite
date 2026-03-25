import express, {Express} from "express";
import "express-async-errors";
import cors from "cors";

import {Orm} from "./orm";
import {GrapeHandlers} from "./handlers/grape.handlers";
import {MemberHandlers} from "./handlers/member.handlers";
import {TastingHandlers} from "./handlers/tasting.handlers";
import {CountryHandlers} from "./handlers/country.handlers";
import {WineTypeHandlers} from "./handlers/wine-type.handlers";
import {WineHandlers} from "./handlers/wine.handlers";
import {WineTastingWineHandlers} from "./handlers/wine-tasting-wine.handlers";
import {WineTastingHostHandlers} from "./handlers/wine-tasting-host.handlers";
import {WineGrapeHandlers} from "./handlers/wine-grape.handlers";
import {ScoreHandlers} from "./handlers/score.handlers";

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
    const wineTastingWineHandlers = new WineTastingWineHandlers(orm);
    const wineTastingHostHandlers = new WineTastingHostHandlers(orm);
    const wineGrapeHandlers = new WineGrapeHandlers(orm);
    const scoreHandlers = new ScoreHandlers(orm);

    router.delete('/api/v1/countries/:id', countryHandlers.deleteCountryById());
    router.get('/api/v1/countries', countryHandlers.getCountries());
    router.post('/api/v1/countries', countryHandlers.postCountries());

    router.delete('/api/v1/grapes/:id', grapeHandlers.deleteGrapeById());
    router.get('/api/v1/grapes/:id', grapeHandlers.getGrapeById());
    router.patch('/api/v1/grapes/:id', grapeHandlers.patchGrape());

    router.get('/api/v1/grapes', grapeHandlers.getAll());
    router.post('/api/v1/grapes', grapeHandlers.create());

    router.delete('/api/v1/members/:id', memberHandlers.deleteMemberById());
    router.patch('/api/v1/members/:id', memberHandlers.patchMemberById());
    router.get('/api/v1/members/:id', memberHandlers.getMemberById());
    router.get('/api/v1/members', memberHandlers.getMembers());
    router.post('/api/v1/members', memberHandlers.postMember());

    router.delete('/api/v1/tastings/:id/wines/:tastingWineId', wineTastingWineHandlers.deleteTastingWine());
    router.patch('/api/v1/tastings/:id/wines/:tastingWineId', wineTastingWineHandlers.patchTastingWine());
    router.post('/api/v1/tastings/:id/wines', wineTastingWineHandlers.postTastingWine());
    router.get('/api/v1/tastings/:id/wines', wineTastingWineHandlers.getTastingWines());

    router.post('/api/v1/tastings/:id/scores', scoreHandlers.postScore());
    router.get('/api/v1/tastings/:id/scores', scoreHandlers.getScores())
    router.delete('/api/v1/tastings/:id/scores/:scoreId', scoreHandlers.deleteByScoreId())
    router.patch('/api/v1/tastings/:id/scores/:scoreId', scoreHandlers.patchByScoreId())

    router.post('/api/v1/tastings/:id/hosts', wineTastingHostHandlers.postTastingHost());
    router.get('/api/v1/tastings/:id/hosts', wineTastingHostHandlers.getTastingHosts());


    router.get('/api/v1/tastings/:id', tastingHandlers.getTasting());
    router.delete('/api/v1/tastings/:id', tastingHandlers.deleteTastingById());
    router.patch('/api/v1/tastings/:id', tastingHandlers.patchTastingById());

    router.get('/api/v1/tastings/', tastingHandlers.getTastings());
    router.post('/api/v1/tastings/', tastingHandlers.postTasting());

    router.get('/api/v1/wines/:id/grapes', wineGrapeHandlers.getWineGrapes());
    router.post('/api/v1/wines/:id/grapes', wineGrapeHandlers.postWineGrape());
    router.delete('/api/v1/wines/:id/grapes/:wineGrapeId', wineGrapeHandlers.deleteWineGrapeById());

    router.delete('/api/v1/wines/:id', wineHandlers.deleteWineById());
    router.get('/api/v1/wines/:id', wineHandlers.getWineById());
    router.patch('/api/v1/wines/:id', wineHandlers.patchWineById());


    router.get('/api/v1/wines', wineHandlers.getWines());

    router.post('/api/v1/wines', wineHandlers.postWine());

    router.post('/api/v1/wine-types', wineTypeHandlers.postWineType());
    router.get('/api/v1/wine-types', wineTypeHandlers.getWineTypes());
    router.delete('/api/v1/wine-types/:id', wineTypeHandlers.deleteWineTypeById());


    router.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(503).json({ error: 'Service temporarily unavailable' });
    })
}
