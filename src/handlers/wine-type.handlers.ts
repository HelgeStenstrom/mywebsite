import {Orm} from "../orm";
import {errorResponse} from "./handlerUtils";

export class WineTypeHandlers {

    constructor(private readonly orm:Orm) {}

    deleteWineTypeById() {
        return async (req, res) => {
            const id = req.params.id;

            const result = await this.orm.wineTypes.delete(id);

            switch (result) {
                case 'deleted':
                    return res.status(204).json("WineType successfully deleted");
                case 'not_found':
                    return errorResponse(res, 404, 'WineType not found');
                case 'in_use':
                    return errorResponse(res, 409, 'WineType is in use');
                default:
                    return errorResponse(res, 503, 'Unknown error');
            }

        };

    }

    postWineType() {
        return async (req, res) => {
            try {
                const wineType = await this.orm.wineTypes.create(req.body);

                res.status(201).json({
                    id: wineType.id,
                    name: wineType.name,
                    isUsed: false
                });
            } catch (e) {
                console.error(e);
                res.status(500).end();
            }
        };
    }


    getWineTypes(): (req, res) => Promise<void> {
        return async (_, res) => {
            try {
                const wineTypes = await this.orm.wineTypes.findAll();
                res.status(200).json(wineTypes);
            } catch (err) {
                console.error('Got error', err);
                res.status(503).send(
                    'Ingen kontakt med databasen. Är Docker startad?'
                );
            }
        };
    }
}