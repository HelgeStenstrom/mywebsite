import {Orm} from "./orm";
import {Member} from "./backendRouting";
// import {Member} from "../hartappat/src/app/services/backend.service";

export class EndpointHandlers {
    constructor(private orm: Orm) {}

    getWines(): (req, res) => Promise<void> {
        return async (req, res) => {
            this.thenJson(this.orm.findWines(), res);
        };
    }

    getMembers(): (req, res) => Promise<void> {
        return async (req, res) => {
            this.thenJson(this.orm.findMembers(), res);
        };
    }

    postMember(): (req, res) => void {

        return async (req, res) => {
            const member: Member = req.body;
            this.orm.postMember(member)
                .then(() => res.status(201).json("postMember called!"))
                .catch(e => console.error(e));

        };
    }

    thenJson(promise: Promise<object[]>, res) {

        return promise
            .then((x) => {
                return res.status(200).json(x);
            })
            .catch(() => {
                res.status(503)
                    .send("Ingen kontakt med databasen. Är Docker startad?");
            });
    }
}