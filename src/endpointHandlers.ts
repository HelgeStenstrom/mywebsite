import {Orm} from "./orm";
import {WineCreateDto} from "./types/wine";


/**
 * This class contains all the endpoint handlers. The endpoint handlers are called when the corresponding
 * endpoint is called. An endpoint is a URL, e.g. http://localhost:3000/grapes,
 * with an http method, e.g. GET, POST, etc.
 */
export class EndpointHandlers {
    constructor(private readonly orm: Orm) {
    }

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




// Wines


    /**
     * Get all wines from the database.
     */
    getWines(): (req, res) => Promise<void> {
        return async (req, res) => {
            const wines = this.orm.findWines();
            this.thenJson(wines, res);
        };
    }

    /**
     * Add a wine to the database.
     */
    postWine() {
        return async (req, res) => {

            const wine: WineCreateDto = req.body;

            const param = {name: wine.name, country: wine.countryId, systembolaget: wine.systembolaget, volume: wine.volume, winetype: wine.wineTypeId};
            this.orm.postWine(param)
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

            this.orm.delWineById(id)
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
