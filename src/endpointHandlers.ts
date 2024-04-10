import { Orm } from "./orm";
import { Wine } from "../hartappat/src/app/services/backend.service";

export class EndpointHandlers {
    constructor(private orm: Orm) {
    }

// Common utilities
    thenJson(promise: Promise<object[]>, res) {

        return promise
            .then((objects) => {
                console.log('thenJson got a promise! ');
                return res.status(200).json(objects);
            })
            .catch((err) => {
                console.error('Got error', err);
                res.status(503)
                    .send("Ingen kontakt med databasen. Är Docker startad?");
            });
    }

// Countries

    postCountry(): (req, res) => void {
        return function (p1, p2) {
            throw Error("not implemented yet");
        };
    }

    getCountries(): (req, res) => Promise<void> {

        return async (req, res) => {
            this.thenJson(this.orm.findCountries(), res);
        };
    }

    postCountries(): (req, res) => Promise<void>  {

        return async (req, res) => {

            this.orm.postCountry(req.body)
                .then(() => res.status(201).json("postCountries called!"))
                .catch(e => console.error(e));

        };
    }


// Grapes

    getGrapes(): (req, res) => Promise<void> {

        return async (req, res) => {
            this.thenJson(this.orm.findGrapes(), res);
        };
    }

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

    postGrape(): (req, res) => Promise<void> {

        return async (req, res) => {

            // We don't want to set the ID number; it should be handled by ORM.
            const grape = {...(req.body), id: null}

            this.orm.postGrape(grape)
                .then((response) => res.status(201).json(response))
                .catch(e => console.error(e));
        };
    }

    patchGrape(): (req, res) => Promise<void>  {

        return async (req, res) => {
            const {from, to} = req.body;

            this.orm.patchGrapeByNameAndColor(from, to)
                .then(() => res.status(200).json("patchGrape called!"))
                .catch(e => console.error(e));
        };
    }

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
    getMembers(): (req, res) => Promise<void> {
        return async (_, res) => {
            this.thenJson(this.orm.findMembers(), res);
        };
    }

    postMember(): (req, res) => Promise<void> {

        return async (req, res) => {
            const member = req.body;
            console.log(`Förnamn: ${member.Given}`)
            return this.orm.postMember(member)
                .then(() => res.status(201).json("postMember called!"))
                .catch(e => console.error(e));

        };
    }

// Tastings

    getTasting(): (req, res) => Promise<void> {

        return async (req, res) => {
            console.log("get tasting with id=", req.params.id);
            this.orm.getTasting(req.params.id)
                .then((x) => res.json(x))
                .catch(e => console.error(e));
        };
    }

    getAllTastings(): (req, res) => Promise<void> {

        return async (req, res) => {
            this.thenJson(this.orm.findTastings(), res);
        };
    }

// Wines

    getWines(): (req, res) => Promise<void> {
        return async (req, res) => {
            this.thenJson(this.orm.findWines(), res);
        };
    }


    postWine() {
        return async (req, res) => {
            console.log('EndpointHandlers.postWine()');

            const wine: Wine = req.body;

            const param = {name: wine.name, country: 3, systembolaget: wine.systembolaget, volume: -1, winetype: 2};
            this.orm.postWine(param)
                .then(() => res.status(201).json("postWine called!"))
                .catch(e => console.error(e));

        };
    }

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
