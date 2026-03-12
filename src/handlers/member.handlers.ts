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
                const members = await this.orm.members.findAll();
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
            return this.orm.members.create(member)
                .then((created: MemberInstance) => res.status(201).json(created))
                .catch(e => console.error(e));

        };
    }

    deleteMemberById() {
        return async (req, res) => {
            const id  = Number(req.params.id);

            const result = await this.orm.members.delete(id);
            switch (result) {
                case 'deleted':
                    return res.status(204).send();
                case 'not_found':
                    return res.status(404).json({error: 'Member not found'});
                // case 'in_use':
                //     return res.status(409).json({error: 'Member is in use'});
                default:
                    return res.status(503).json({error: 'Unknown error'});
            }

        }
    }
}