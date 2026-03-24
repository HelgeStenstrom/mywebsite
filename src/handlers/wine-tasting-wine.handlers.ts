import {Orm} from "../orm";
import {WineTastingWineCreateDto} from "../types/wine-tasting";

export class WineTastingWineHandlers {

    constructor(private readonly orm: Orm) {}

    getTastingWines() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);

            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return res.status(400).json({ error: 'Invalid tasting id' });
            }

            const wines = await this.orm.tastingWines.findByTastingId(tastingId);
            res.status(200).json(wines);

        };
    }

    postTastingWine() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);

            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return res.status(400).json({ error: 'Invalid tasting id' });
            }

            const data: WineTastingWineCreateDto = req.body;
            const created = await this.orm.tastingWines.create(tastingId, data);
            res.status(201).json(created);
        };    }

    deleteTastingWine() {

        return async (req, res) => {
            const tastingId = Number(req.params.id);
            const tastingWineId = Number(req.params.tastingWineId);

            const deleted = await this.orm.tastingWines.delete(tastingId, tastingWineId);
            if (deleted === "deleted") {
                res.status(204).send();
            }
            return res.status(404).json({error: 'Wine tasting wine not found'});
        }

    }

    patchTastingWine() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            const tastingWineId = Number(req.params.tastingWineId);
            const data = req.body;
            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return res.status(400).send({ error: 'Invalid tasting id' });
            }

            const winesOfTasting = await this.orm.tastingWines.findByTastingId(tastingId);
            if (!winesOfTasting.some(w => w.id === tastingWineId)) {
                return res.status(404).json({ error: 'Wine tasting wine not found' });
            }

            const updated = await this.orm.tastingWines.update(tastingWineId, data);
            if (!updated) {
                res.status(404).json({ status: 404, message: 'Wine tasting wine not found' });
                return;
            }
            res.status(200).json(updated);

        }
    }
}