import {Orm} from "../orm";

export class MemberHandlers {

    constructor(private orm: Orm) { }

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
}