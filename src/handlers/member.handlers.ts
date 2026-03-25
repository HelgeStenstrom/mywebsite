import {Orm} from "../orm";
import {MemberInstance} from "../types/member";
import {errorResponse} from "./handlerUtils";

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
                    return errorResponse(res, 404, 'Member not found');
                default:
                    return errorResponse(res, 503, 'Unknown error');
            }

        }
    }

    patchMemberById() {
        return async (req, res) => {
            const id = Number(req.params.id);
            const data = req.body;
            if (!id || isNaN(id) || id <= 0) {
                return errorResponse(res, 400, 'Invalid member id');
            }

            const updated = await this.orm.members.update(id, data);
            if (!updated) {
                res.status(404).json({ status: 404, message: 'Member not found' });
                return;
            }
            res.status(200).json(updated);
        }
    }

    getMemberById() {
        return async (req, res) => {
            try {
                const id = Number(req.params.id);
                const member = await this.orm.members.findById(id);

                if (!member) {
                   return res.status(404).json({ message: `Member with id ${id} not found` });

                }
                res.status(200).json(member);

            } catch (e) {
                console.error(e);
                res.status(500).end();
            }

        }
    }
}