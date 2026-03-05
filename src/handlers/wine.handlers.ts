import {Orm} from "../orm";
import {WineCreateDto} from "../types/wine";

export class WineHandlers {

    constructor(private readonly orm:Orm) {}


    /**
     * Get all wines from the database.
     */
    getWines(): (req, res) => Promise<void> {
        return async (_, res) => {
            try {
                const wines = await this.orm.wines.findWines();
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

            let vintageYear = wine.vintageYear ?? null;
            const isNonVintage = wine.isNonVintage ?? false;

            if (isNonVintage) {
                vintageYear = null;
            }


            this.orm.wines.postWine(wine)
                .then(() => res.status(201).json("postWine called!"))
                .catch(e => console.error(e));

        };
    }


    /**
     * Delete a wine from the database, identified by its ID.
     */
    deleteWineById() {
        return async (req, res) => {
            const id = req.params.id;

            this.orm.wines.delWineById(id)
                .then((gnum) => {
                    if (gnum)
                        return res.status(204).json("Wine successfully deleted");
                    else
                        return res.status(404).json({error: 'Wine not found'});
                })
                .catch(e => console.error(e));
        };

    }


}