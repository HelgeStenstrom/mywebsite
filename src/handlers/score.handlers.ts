import {Orm} from "../orm";
import {ScoreCreateDto} from "../types/score";
import {errorResponse} from "./handlerUtils";

export class ScoreHandlers {

    constructor(private orm: Orm) {
    }

    postScore() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }
            const data: ScoreCreateDto = req.body;
            const created = await this.orm.scores.create(tastingId, data);
            res.status(201).json(created);
        }
    }

    getScores() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }

            const scores = await this.orm.scores.findAllByTastingId(tastingId);
            res.status(200).json(scores);

        }
    }

    deleteByScoreId() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            const scoreId = Number(req.params.scoreId);
            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }
            if (!scoreId || isNaN(scoreId) || scoreId <= 0) {
                return errorResponse(res, 400, 'Invalid score id');
            }

            const deleted = await this.orm.scores.delete(scoreId);

            if (deleted === "deleted") {
                res.status(204).send();
            } else {
                errorResponse(res, 404, 'Score not found');
            }

        }
    }


    patchByScoreId() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            const scoreId = Number(req.params.scoreId);
            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }
            if (!scoreId || isNaN(scoreId) || scoreId <= 0) {
                return errorResponse(res, 400, 'Invalid score id');
            }
            const score = req.body;

            const updated = await this.orm.scores.update(scoreId, score);
            if (!updated) {
                errorResponse(res, 404, 'Score not found');
                return;
            }

            res.status(200).json(updated);
        }
    }
}