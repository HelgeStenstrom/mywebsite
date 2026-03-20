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

    deleteWineGrapeById() {
        return async (req, res) => {
            const wineId = Number(req.params.id);
            const wineGrapeId = Number(req.params.wineGrapeId);

            // wineId doesn't seem to be needed to be able to delete a wine grape,
            // but let's test that the selected wine actually contains the grape to be deleted.

            const wineGrapeDtos = await this.orm.wines.findById(wineId);
            if (!wineGrapeDtos) {
                return res.status(404).json({error: 'Wine not found'});
            }
            const wineGrapeIds = wineGrapeDtos.grapes.map(g => g.id);

            if (!wineGrapeIds.includes(Number(wineGrapeId))) {
                return res.status(404).json({error: 'Wine grape not found'});
            }

            const deleted = await this.orm.wineGrapes.delete(wineGrapeId);
            if (!deleted) {
                return res.status(404).json({error: 'Wine grape not found'});
            }
            res.status(204).send();
        };
    }
}