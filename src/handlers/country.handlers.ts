import {Orm} from "../orm";
import {errorResponse} from "./handlerUtils";

export class CountryHandlers {

    constructor(private readonly orm: Orm) {}


    // Countries

    /**
     * Get all countries from the database.
     */
    getCountries(): (req, res) => Promise<void> {
        return async (_, res) => {
            try {
                const countries = await this.orm.countries.findAll();
                res.status(200).json(countries);
            } catch (err) {
                console.error('Got error', err);
                res.status(503).send(
                    'Ingen kontakt med databasen. Är Docker startad?'
                );
            }
        };
    }


    /**
     * Add a country to the database.
     */
    postCountries(): (req, res) => Promise<void>  {

        return async (req, res) => {

            try {

                const country = await this.orm.countries.create(req.body);

                res.status(201).json(country);
            } catch (e) {
                console.error(e);
                res.status(500).end();
            }

        };
    }


    deleteCountryById() {
        return async (req, res) => {
            const id = req.params.id;

            const result = await this.orm.countries.delete(id);

            switch (result) {
                case 'deleted':
                    return res.status(204).send();
                case 'not_found':
                    return errorResponse(res, 404, 'Country not found');
                case 'in_use':
                    return errorResponse(res, 409, 'Country is in use');
                default:
                    return errorResponse(res, 503, 'Unknown error');
            }
        };
    }

}