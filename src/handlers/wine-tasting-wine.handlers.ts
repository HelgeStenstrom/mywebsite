import {Orm} from "../orm";
import {WineTastingWineCreateDto, WineTastingWineDto} from "../types/wine-tasting";
import {errorResponse} from "./handlerUtils";

export class WineTastingWineHandlers {

    constructor(private readonly orm: Orm) {}

    getTastingWines() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);

            if (!tastingId || Number.isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }

            const wines = await this.orm.tastingWines.findByTastingId(tastingId);
            res.status(200).json(wines);

        };
    }

    postTastingWine() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);

            if (!tastingId || Number.isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
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
            return errorResponse(res, 404, 'Wine tasting wine not found');
        }

    }

    getTastingWine() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            const tastingWineId = Number(req.params.tastingWineId);

            const wines = await this.orm.tastingWines.findByTastingId(tastingId);
            const tastingWine = wines.find(w => w.id === tastingWineId);

            if (!tastingWine) {
                res.status(404).json({ status: 404, message: 'Tasting wine not found' });
                return;
            }

            const result: WineTastingWineDto = {
                id: tastingWineId,
                wineId: tastingWine.wineId,
                position: tastingWine.position,
                averageScore: tastingWine.averageScore,
                purchasePrice: tastingWine.purchasePrice,
                scoreStdDev: tastingWine.scoreStdDev,
            };
            res.status(200).json(result);
        };
    }

    patchTastingWine() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            const tastingWineId = Number(req.params.tastingWineId);
            const data = req.body;
            if (!tastingId || Number.isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }

            const winesOfTasting = await this.orm.tastingWines.findByTastingId(tastingId);
            if (!winesOfTasting.some(w => w.id === tastingWineId)) {
                return errorResponse(res, 404, 'Wine tasting wine not found');
            }

            const updated = await this.orm.tastingWines.update(tastingWineId, data);
            if (!updated) {
                res.status(404).json({ status: 404, message: 'Wine tasting wine not found' });
                return;
            }
            res.status(200).json(updated);

        }
    }

    putWinePositions() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            if (!tastingId || Number.isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }
            const positions: { id: number, position: number }[] = req.body;
            await this.orm.tastingWines.updatePositions(tastingId, positions);
            res.status(204).send();
        };
    }
}