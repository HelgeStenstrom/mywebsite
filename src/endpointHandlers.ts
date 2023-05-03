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
        promise
            .then((x) => res.json(x))
            .catch(e => console.error(e));
    }
}
