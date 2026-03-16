import {Orm} from "../orm";
import {WineGrapeCreateDto} from "../types/wine";

export class WineGrapeHandlers {

    constructor(private readonly orm: Orm) {}

    getWineGrapes() {
        return async (req, res) => {
            const wineId = parseInt(req.params.id);
            if (!wineId || isNaN(wineId) || wineId <= 0) {
                return res.status(400).json({error: 'Invalid wine id'});
            }
            const grapes = await this.orm.wineGrapes.findByWineId(wineId);
            res.status(200).json(grapes);
        };
    }

    postWineGrape() {
        return async (req, res) => {
            const wineId = parseInt(req.params.id);
            if (!wineId || isNaN(wineId) || wineId <= 0) {
                return res.status(400).json({error: 'Invalid wine id'});
            }
            const data: WineGrapeCreateDto = req.body;
            const created = await this.orm.wineGrapes.create(wineId, data);
            res.status(201).json(created);
        };
    }
}