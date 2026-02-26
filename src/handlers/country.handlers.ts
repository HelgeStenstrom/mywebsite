import {Orm} from "../orm";
import {CountryDto} from "../types/country";

export class CountryHandlers {

    constructor(private readonly orm: Orm) {}

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

}