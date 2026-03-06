import {TastingInstance, WineTastingCreateDto, WineTastingDto, WineTastingHostInstance} from "../../types/wine-tasting";
import {ModelStatic} from "sequelize";
import {BadRequestError} from "../../errors/bad-request-error";
import {MemberInstance} from "../../types/member";

export class TastingRepository {
    constructor(
        private readonly Tasting: ModelStatic<TastingInstance>,
        private readonly TastingHost: ModelStatic<WineTastingHostInstance>,
        private readonly Member: ModelStatic<MemberInstance>,
        ) {}

    async postTasting(t: WineTastingCreateDto): Promise<WineTastingDto> {
        if (!t.title || !t.notes || !t.tastingDate) {
            throw new BadRequestError('Missing required fields: title, notes, tastingDate');
        }
        const toCreate = {
            title: t.title,
            notes: t.notes,
            tastingDate: t.tastingDate,
        };
        const created = await this.Tasting.create(toCreate);

        if (t.hostIds?.length) {
            await this.TastingHost.bulkCreate(
                t.hostIds.map(id => ({
                    wineTastingId: created.id,
                    memberId: id
                }))
            );
        }

        return this.toTastingDto(created);
    }

    private toTastingDto(t: TastingInstance): WineTastingDto {
        return {
            id: t.id,
            title: t.title,
            notes: t.notes,
            tastingDate: t.tastingDate,
            hosts: (t.wineTastingHosts ?? []).map(h => ({
                memberId: h.memberId,
            })),
        };
    }

    findTastings(): Promise<WineTastingDto[]> {
        const tastings = this.Tasting.findAll(
            {
                include: [{
                        model: this.TastingHost,
                        as: 'wineTastingHosts',
                        include: [{model: this.Member, as: 'member'}]
                    }
                ]
            }
        );
        return tastings.then(ts => ts.map(t => this.toTastingDto(t)));
    }

    async getTasting(id: number): Promise<WineTastingDto | null> {
        const tasting = await this.Tasting.findByPk(id);

        if (!tasting) {
            return null;
        }

        return this.toTastingDto(tasting);
    }


}