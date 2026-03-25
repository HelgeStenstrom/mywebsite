import {Orm} from "../orm";
import {WineCreateDto} from "../types/wine";
import {errorResponse} from "./handlerUtils";

export class WineHandlers {

    constructor(private readonly orm:Orm) {}


    /**
     * Get all wines from the database.
     */
    getWines(): (req, res) => Promise<void> {
        return async (_, res) => {
            try {
                const wines = await this.orm.wines.findAll();
                res.status(200).json(wines);
            } catch (err) {
                console.error('Got error', err);
                res.status(503).send(
                    'Ingen kontakt med databasen. Är Docker startad?'
                );
            }
        };
    }


    /**
     * Add a wine to the database.
     */
    postWine() {
        return async (req, res) => {

            const wine: WineCreateDto = req.body;
            if (wine.isNonVintage && wine.vintageYear) {
                return errorResponse(res, 400, 'vintageYear must be null when isNonVintage is true');
            }

            this.orm.wines.create(wine)
                .then((created) => res.status(201).json(created))
                .catch(e => console.error(e));

        };
    }


    /**
     * Delete a wine from the database, identified by its ID.
     */
    deleteWineById() {
        return async (req, res) => {
            const id = req.params.id;

            this.orm.wines.delete(id)
                .then((gnum) => {
                    if (gnum)
                        return res.status(204).json("Wine successfully deleted");
                    else
                        return errorResponse(res, 404, 'Wine not found');
                })
                .catch(e => console.error(e));
        };

    }


    getWineById(): (req, res) => Promise<void> {
        return async (req, res) => {
            const id = Number(req.params.id);

            const wine = await this.orm.wines.findById(id);
            if (!wine) {
                res.status(404).json({ message: `Wine with id ${id} not found` });
                return;
            }
            res.status(200).json(wine);
        }
    }

    patchWineById() {
        return async (req, res) => {
            const id = Number(req.params.id);
            const data = req.body;
            if (!id || isNaN(id) || id <= 0) {
                return errorResponse(res, 400, 'Invalid wine id');
            }

            const updated = await this.orm.wines.update(id, data);
            if (!updated) {
                res.status(404).json({ status: 404, message: 'Wine not found' });
                return;
            }
            res.status(200).json(updated);
        }
    }
}