import {Orm} from "../orm";
import {WineTastingWineCreateDto} from "../types/wine-tasting";

export class WineTastingWineHandlers {

    constructor(private readonly orm: Orm) {}

    getTastingWines() {
        return async (req, res) => {
            const tastingId = parseInt(req.params.id);

            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return res.status(400).json({ error: 'Invalid tasting id' });
            }

            const wines = await this.orm.tastingWines.findByTastingId(tastingId);
            res.status(200).json(wines);

        };
    }

    postTastingWine() {
        return async (req, res) => {
            const tastingId = parseInt(req.params.id);

            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return res.status(400).json({ error: 'Invalid tasting id' });
            }

            const data: WineTastingWineCreateDto = req.body;
            const created = await this.orm.tastingWines.create(tastingId, data);
            res.status(201).json(created);
        };    }

    deleteTastingWine() {

        return async (req, res) => {
            const tastingId = parseInt(req.params.id);
            const tastingWineId = parseInt(req.params.tastingWineId);

            const deleted = await this.orm.tastingWines.delete(tastingId, tastingWineId);
            if (deleted === "deleted") {
                res.status(204).send();
            }
            return res.status(404).json({error: 'Wine tasting wine not found'});
        }

    }
}