import { Orm } from "./orm";
import { Wine } from "../hartappat/src/app/services/backend.service";

export class EndpointHandlers {
    constructor(private orm: Orm) {}

    getWines(): (req, res) => Promise<void> {
        return async (req, res) => {
            this.thenJson(this.orm.findWines(), res);
        };
    }

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

    postWine() {
        return async (req, res) => {
            console.log('EndpointHandlers.postWine()');

            const wine: Wine = req.body;

            const param = {name:wine.name, country:3, systembolaget:wine.systembolaget, volume:-1, winetype:2};
            this.orm.postWine(param)
                .then(() => res.status(201).json("postWine called!"))
                .catch(e => console.error(e));

        };
    }

    postCountry(): (req, res) => void {
        return function (p1, p2) {
            throw Error("not implemented yet");
        };
    }

    getCountries(): (req, res) => Promise<void>  {
        throw Error("not implemented yet");
    }

    deleteWineById() {
        return async (req, res) => {
            const id = req.params.id;

            this.orm.delWineById(id)
                .then((gnum) => {
                    if (gnum)
                        return res.status(204).json("Wine successfully deleted");
                    else
                        return res.status(404).json({ error: 'Wine not found' });
                })
                .catch(e => console.error(e));
        };

    }
}
