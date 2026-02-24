import {Orm} from "./orm";
import {WineCreateDto} from "./types";

//import {Wine} from "../hartappat/src/app/services/backend.service";


/**
 * This class contains all the endpoint handlers. The endpoint handlers are called when the corresponding
 * endpoint is called. An endpoint is a URL, e.g. http://localhost:3000/grapes,
 * with an http method, e.g. GET, POST, etc.
 */
export class EndpointHandlers {
    constructor(private orm: Orm) {
    }

// Common utilities

    /**
     * This function takes a promise and returns a JSON response. If the promise fails, an error message is returned.
     * @param promise
     * @param res
     */
    thenJson(promise: Promise<object[]>, res) {

        return promise
            .then((objects) => {
                return res.status(200).json(objects);
            })
            .catch((err) => {
                console.error('Got error', err);
                res.status(503)
                    .send("Ingen kontakt med databasen. Är Docker startad?");
            });
    }

// Countries

    /**
     * Add a country to the database.
     * @deprecated Use postCountries instead.
     *
     */
    postCountry(): (req, res) => void {
        return function (p1, p2) {
            throw Error("not implemented yet");
        };
    }

    /**
     * Get all countries from the database.
     */
    getCountries(): (req, res) => Promise<void> {

        return async (req, res) => {
            this.thenJson(this.orm.findCountries(), res);
        };
    }

    /**
     * Add a country to the database.
     */
    postCountries(): (req, res) => Promise<void>  {

        return async (req, res) => {

            try {

                const country = await this.orm.postCountry(req.body);

                res.status(201).json({
                    id: country.id,
                    name: country.name,
                    isUsed: false
                });
            } catch (e) {
                console.error(e);
                res.status(500).end();
            }

        };
    }


// Grapes

    /**
     * Get all grapes from the database.
     */
    getGrapes(): (req, res) => Promise<void> {

        return async (req, res) => {
            this.thenJson(this.orm.findGrapes(), res);
        };
    }

    /**
     * Get a grape by ID.
     */
    getGrapeById() {

        return async (req, res) => {
            this.orm.getGrape(req.params.id)
                .then((grape) => {
                    if (grape)
                        return res.status(200).json(grape);
                    else
                        return res.status(404).json({ error: 'Grape not found' });
                })
                .catch(e => console.error(e));
            // TODO: Consider variant of return res.status(500).json({ error: 'Internal Server Error' })

        };
    }

    /**
     * Add a grape to the database.
     * @param req request body
     * @param res response
     * @returns {Promise<void>}
     */
    postGrape(): (req, res) => Promise<void> {

        return async (req, res) => {

            // We don't want to set the ID number; it should be handled by ORM.
            const grape = {...(req.body), id: null}

            try {
                const response = await this.orm.postGrape(grape);
                res.status(201).json(response);
            } catch (e) {
                if (e.name === 'SequelizeValidationError') {
                    res.status(400).json({
                        error: 'Validation failed',
                        details: e.errors.map(err => ({
                            field: err.path,
                            message: err.message
                        }))
                    });
                    return;
                }
                console.error(e);
                res.status(500).json({ error: 'Internal Server Error' });
            }

            // this.orm.postGrape(grape)
            //     .then((response) => res.status(201).json(response))
            //     .catch(e => console.error(e));
        };
    }


    /**
     * Replace an existing grape with a new one, without changing its ID.
     */
    patchGrape(): (req, res) => Promise<void>  {

        return async (req, res) => {
            const {from, to} = req.body;

            this.orm.patchGrapeByNameAndColor(from, to)
                .then(() => res.status(200).json("patchGrape called!"))
                .catch(e => console.error(e));
        };
    }

    /**
     * Delete a grape from the database, identified by its ID.
     */
    deleteGrapeById() {
        return async (req, res) => {
            const id = req.params.id;

            this.orm.delGrapeById(id)
                .then((gnum) => {
                    if (gnum)
                        return res.status(204).json("Grape successfully deleted");
                    else
                        return res.status(404).json({ error: 'Grape not found' });
                })
                .catch(e => console.error(e));
        };
    }

// Members

    /**
     * Get all members from the database.
     */
    getMembers(): (req, res) => Promise<void> {
        return async (_, res) => {
            this.thenJson(this.orm.findMembers(), res);
        };
    }


    /**
     * Add a member to the database.
     */
    postMember(): (req, res) => Promise<void> {

        return async (req, res) => {
            const member = req.body;
            return this.orm.postMember(member)
                .then(() => res.status(201).json("postMember called!"))
                .catch(e => console.error(e));

        };
    }

// Tastings

    /**
     * Get a tasting by ID.
     */
    getTasting(): (req, res) => Promise<void> {

        return async (req, res) => {
            console.log("get tasting with id=", req.params.id);
            this.orm.getTasting(req.params.id)
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }

    /**
     * Get all tastings from the database.
     */
    getAllTastings(): (req, res) => Promise<void> {

        return async (req, res) => {
            this.thenJson(this.orm.findTastings(), res);
        };
    }

// Wines

    /**
     * Get all wines from the database.
     */
    getWines(): (req, res) => Promise<void> {
        return async (req, res) => {
            this.thenJson(this.orm.findWines(), res);
        };
    }


    /**
     * Add a wine to the database.
     */
    postWine() {
        return async (req, res) => {
            //console.log('EndpointHandlers.postWine()');

            const wine: WineCreateDto = req.body;

            const param = {name: wine.name, country: wine.countryId, systembolaget: wine.systembolaget, volume: wine.volume, winetype: wine.wineTypeId};
            this.orm.postWine(param)
                .then(() => res.status(201).json("postWine called!"))
                .catch(e => console.error(e));

        };
    }

    deleteCountryById() {
        return async (req, res) => {
            const id = req.params.id;

            const result = await this.orm.delCountryById(id);

            switch (result) {
                case 'deleted':
                    return res.status(204).json("Country successfully deleted");
                case 'not_found':
                    return res.status(404).json({error: 'Country not found'});
                case 'in_use':
                    return res.status(409).json({error: 'Country is in use'});
                default:
                    return res.status(503).json({error: 'Unknown error'});
            }

        };
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
            this.thenJson(this.orm.findWineTypes(), res);
        };

    }
}
