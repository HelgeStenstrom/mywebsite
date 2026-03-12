import {WineTastingCreateDto} from "../types/wine-tasting";
import {BadRequestError} from "../errors/bad-request-error";
import {Orm} from "../orm";

export class TastingHandlers {

    constructor(private readonly orm:Orm) {}

    // Tastings

    /**
     * Get a tasting by ID.
     */
    getTasting(): (req, res) => Promise<void> {
        return async (req, res) => {
            try {
                const tasting = await this.orm.tastings.findById(Number(req.params.id));

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

    deleteTastingById() {
        return async (req, res) => {
            const id = req.params.id;
            const deleted = await this.orm.tastings.deleteTastingById(id);
            if (!deleted) {
                res.status(404).json({ message: `Tasting with id ${id} not found` });
                return;
            }
            res.status(204).send();
        }
    }

    /**
     * Get all tastings from the database.
     */
    getTastings(): (req, res) => Promise<void> {
        return async (req, res) => {
            try {
                const tastings = await this.orm.tastings.findAll(); // returnerar TastingDto[]
                res.status(200).json(tastings);                 // skickar DTO-listan som JSON
            } catch (e) {
                console.error(e);
                res.status(500).end();                          // hanterar eventuella fel
            }
        };
    }

    postTasting() {
        return async (req, res) => {
            try {
                const tasting = await this.orm.tastings.create(req.body as WineTastingCreateDto);
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