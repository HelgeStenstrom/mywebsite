import {Orm} from "../orm";
import {WineTastingHostCreateDto, WineTastingHostDto} from "../types/wine-tasting";
import {errorResponse} from "./handlerUtils";

export class WineTastingHostHandlers {

    constructor(private readonly orm: Orm) {
    }


    postTastingHost() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            const hostId = Number(req.body.hostId);

            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }

            const data: WineTastingHostCreateDto = req.body;
            const created: WineTastingHostDto = await this.orm.wineTastingHosts.create(tastingId, data);
            res.status(201).json(created);
        }
    }

    getTastingHosts() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);

            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }

            const hosts = await this.orm.wineTastingHosts.findByTastingId(tastingId);
            res.status(200).json(hosts);
        }
    }

    putTastingHosts() {
        return async (req, res) => {
            const tastingId = Number(req.params.id);
            if (!tastingId || isNaN(tastingId) || tastingId <= 0) {
                return errorResponse(res, 400, 'Invalid tasting id');
            }
            const hosts: WineTastingHostCreateDto[] = req.body;
            await this.orm.wineTastingHosts.replaceAll(tastingId, hosts);
            res.status(204).send();
        };
    }

}