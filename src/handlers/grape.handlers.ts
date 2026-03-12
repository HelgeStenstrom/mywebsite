import {Orm} from "../orm";
import {GrapeCreateDto} from "../types/grape";

export class GrapeHandlers {

    constructor(private orm: Orm) { }

    getAll() {
        return async (req, res) => {
            const grapes = await this.orm.grapes.findAll();
            res.json(grapes);
        };
    }

    create() {
        return async (req, res) => {
            try {
                const grape = await this.orm.grapes.create(req.body);
                res.status(201).json(grape);
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

            const id = parseInt(req.params.id);
            const data: GrapeCreateDto = req.body;

            if (!id || isNaN(id) || id <= 0) {
                return res.status(400).send({ error: 'Invalid grape id' });
            }

            const updated = await this.orm.grapes.update(id, data);
            if (!updated) {
                res.status(404).json({ status: 404, message: 'Grape not found' });
                return;
            }
            res.status(200).json(updated);
        };
    }

    /**
     * Get a grape by ID.
     */
    getGrapeById() {

        return async (req, res) => {
            try {
                const id = Number(req.params.id);
                const grape = await this.orm.grapes.findById(id);

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
     * Delete a grape from the database, identified by its ID.
     */
    deleteGrapeById() {
        return async (req, res) => {
            const id = req.params.id;

            this.orm.grapes.delete(id)
                .then((gnum) => {
                    if (gnum)
                        return res.status(204).json("Grape successfully deleted");
                    else
                        return res.status(404).json({ error: 'Grape not found' });
                })
                .catch(e => console.error(e));
        };
    }

    putGrapeById() {
        return async (req, res) => {

            try {
                const id = Number(req.params.id);
                console.log('putGrapeById() called with id = ' + id);
                await this.orm.grapes.update(id, req.body as GrapeCreateDto);
                console.log('Sending 204, no content');
                res.status(204).end();
            } catch (e) {
                console.error(e);
                res.status(404).json({ status: 404, message: e.message });
            }
        }
    }


}