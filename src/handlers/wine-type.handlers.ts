import {Orm} from "../orm";

export class WineTypeHandlers {

    constructor(private readonly orm:Orm) {}

    // Common utilities

    /**
     * This function takes a promise and returns a JSON response. If the promise fails, an error message is returned.
     * @param promise
     * @param res
     */
    thenJson<T>(promise: Promise<T>, res): Promise<void> {

        return promise
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => {
                console.error('Got error', err);
                res.status(503)
                    .send("Ingen kontakt med databasen. Är Docker startad?");
            });
    }



    deleteWineTypeById() {
        return async (req, res) => {
            const id = req.params.id;

            const result = await this.orm.delWineTypeById(id);

            switch (result) {
                case 'deleted':
                    return res.status(204).json("WineType successfully deleted");
                case 'not_found':
                    return res.status(404).json({error: 'WineType not found'});
                case 'in_use':
                    return res.status(409).json({error: 'WineType is in use'});
                default:
                    return res.status(503).json({error: 'Unknown error'});
            }

        };

    }

    postWineType() {
        return async (req, res) => {
            try {
                const wineType = await this.orm.postWineType(req.body);

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
        return async (req, res) => {
            const wineTypes = this.orm.findWineTypes();
            this.thenJson(wineTypes, res);
        };

    }
}