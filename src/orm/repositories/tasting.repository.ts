import {
    WineTastingCreateDto,
    WineTastingDto,
    WineTastingHostInstance,
    WineTastingInstance,
    WineTastingSummaryDto,
    WineTastingWineInstance
} from "../../types/wine-tasting";
import {ModelStatic} from "sequelize";
import {BadRequestError} from "../../errors/bad-request-error";
import {MemberInstance} from "../../types/member";
import {ScoreInstance} from "../../types/score";
import {WineTastingWineRepository} from "./wine-tasting-wine.repository";

export class TastingRepository {

    private readonly tastingWines: WineTastingWineRepository;

    constructor(
        private readonly Tasting: ModelStatic<WineTastingInstance>,
        private readonly TastingHost: ModelStatic<WineTastingHostInstance>,
        private readonly Member: ModelStatic<MemberInstance>,
        private readonly WineTastingWine: ModelStatic<WineTastingWineInstance>,
        private readonly Score: ModelStatic<ScoreInstance>,
        ) {
        this.tastingWines = new WineTastingWineRepository(this.WineTastingWine, this.Score);
    }

    async create(t: WineTastingCreateDto): Promise<WineTastingDto> {
        if (!t.title || t.notes === undefined || t.notes === null || !t.tastingDate) {
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

    private toTastingSummaryDto(t: WineTastingInstance): WineTastingSummaryDto {
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

    private toTastingDto(t: WineTastingInstance): WineTastingDto {
        return {
            id: t.id,
            title: t.title,
            notes: t.notes,
            tastingDate: t.tastingDate,
            hosts: (t.wineTastingHosts ?? [])
                .map(h => ({
                    memberId: h.memberId,
                })),
            wines: (t.wineTastingWines ?? [])
                .map(w => ({
                    id: w.id,
                    wineId: w.wineId,
                    position: w.position,
                    purchasePrice: w.purchasePrice ?? null,
                    averageScore: w.averageScore ?? null,
                }))
        };
    }

    async findAll(): Promise<WineTastingSummaryDto[]> {
        const tastings = await this.Tasting.findAll(
            {
                include: [{
                    model: this.TastingHost,
                    as: 'wineTastingHosts',
                    include: [{model: this.Member, as: 'member'}]
                }
                ]
            }
        );
        return tastings.map(t => this.toTastingSummaryDto(t));
    }

    async findById(id: number): Promise<WineTastingDto | null> {
        const tasting = await this.Tasting.findByPk(id,
            {
                include: [
                    {
                        model: this.TastingHost,
                        as: 'wineTastingHosts',
                        include: [{model: this.Member, as: 'member'}]
                    },
                ]
            }
        );

        if (!tasting) {
            return null;
        }

        const wines = await this.tastingWines.findByTastingId(id);

        return {
            id: tasting.id,
            title: tasting.title,
            notes: tasting.notes,
            tastingDate: tasting.tastingDate,
            hosts: (tasting.wineTastingHosts ?? [])
                .map(h => ({ memberId: h.memberId })),
            wines,
        };
    }

    async deleteTastingById(id: number): Promise<boolean> {
        await this.WineTastingWine.destroy({ where: { wineTastingId: id } });
        await this.TastingHost.destroy({ where: { wineTastingId: id } });
        const deleted = await this.Tasting.destroy({ where: { id } });
        return deleted > 0;
    }

    async update(id: number, tasting: WineTastingCreateDto): Promise<WineTastingDto | null> {
        const {id: _ignored, ...safeData} = tasting as any;
        await this.Tasting.update(safeData, {where: {id}})

        const updated = await this.Tasting.findByPk(id);
        if (!updated) {
            return null;
        }
        return this.toTastingDto(updated)

    }
}