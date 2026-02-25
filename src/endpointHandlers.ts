import {BadRequestError, Orm} from "./orm";
import {CountryDto} from "./types/country";
import {WineCreateDto} from "./types/wine";
import {GrapeCreate} from "./types/grape";
import {TastingCreate} from "./types/tasting";


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

// Countries

    /**
     * Get all countries from the database.
     */
    getCountries(): (req, res) => Promise<void> {

        return async (req, res) => {
            const countries = this.orm.findCountries();
            await this.thenJson<CountryDto[]>(countries, res);
        };
    }

    /**
     * Add a country to the database.
     */
    postCountries(): (req, res) => Promise<void>  {

        return async (req, res) => {

            try {

                const country = await this.orm.postCountry(req.body);

                res.status(201).json(country);
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
            const grapes = this.orm.findGrapes();
            await this.thenJson(grapes, res);
        };
    }

    /**
     * Get a grape by ID.
     */
    getGrapeById() {

        return async (req, res) => {
            try {
                const id = Number(req.params.id);
                const grape = await this.orm.getGrape(id);

                if (!grape) {
                    return res.status(404).json({ error: 'Grape not found' });
                }

                return res.status(200).json(grape);
            } catch (e) {
                console.error(e);
                res.status(500).end();
            }
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

            try {
                const response = await this.orm.postGrape(req.body as GrapeCreate);
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
            const members = this.orm.findMembers();
            this.thenJson(members, res);
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
            try {
                const tasting = await this.orm.getTasting(Number(req.params.id));

                if (!tasting) {
                    return res.status(404).json({ error: 'Tasting not found' });
                }

                return res.status(200).json(tasting);
            } catch (e) {
                console.error(e);
                res.status(500).end();
            }
        };
    }

    /**
     * Get all tastings from the database.
     */
    getTastings(): (req, res) => Promise<void> {
        return async (req, res) => {
            try {
                const tastings = await this.orm.findTastings(); // returnerar TastingDto[]
                res.status(200).json(tastings);                 // skickar DTO-listan som JSON
            } catch (e) {
                console.error(e);
                res.status(500).end();                          // hanterar eventuella fel
            }
        };
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
            const wineTypes = this.orm.findWineTypes();
            this.thenJson(wineTypes, res);
        };

    }

    postTasting() {
        return async (req, res) => {
            try {
                const tasting = await this.orm.postTasting(req.body as TastingCreate);
                res.status(201).json(tasting);
            } catch (e) {
                if (e instanceof BadRequestError) {
                    return res.status(400).json({ error: e.message });
                }

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
                res.status(500).json({error: 'Internal Server Error'});
            }
        }
    }
}
