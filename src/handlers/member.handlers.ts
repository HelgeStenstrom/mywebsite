import {Orm} from "../orm";
import {MemberInstance} from "../types/member";

export class MemberHandlers {

    constructor(private readonly orm: Orm) { }

    /**
     * Get all members from the database.
     */
    getMembers(): (req, res) => Promise<void> {
        return async (_, res) => {
            try {
                const members = await this.orm.members.findMembers();
                res.status(200).json(members);
            } catch (err) {
                console.error('Got error', err);
                res.status(503).send(
                    'Ingen kontakt med databasen. Är Docker startad?'
                );
            }
        };
    }

    /**
     * Add a member to the database.
     */
    postMember(): (req, res) => Promise<void> {

        return async (req, res) => {
            const member = req.body;
            return this.orm.members.postMember(member)
                .then((created: MemberInstance) => res.status(201).json(created))
                .catch(e => console.error(e));

        };
    }
}