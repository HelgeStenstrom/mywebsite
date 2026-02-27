import {TastingCreate, TastingDto, TastingInstance} from "../../types/tasting";
import {ModelStatic} from "sequelize";
import {BadRequestError} from "../../errors/bad-request-error";

export class TastingRepository {
    constructor(private Tasting: ModelStatic<TastingInstance>) {}

    async postTasting(t: TastingCreate): Promise<TastingDto> {
        if (!t.title || !t.notes || !t.date) {
            throw new BadRequestError('Missing required fields: title, notes, date');
        }
        const created = await this.Tasting.create(t);
        return this.toTastingDto(created);
    }

    private toTastingDto(t: TastingInstance): TastingDto {
        return {
            id: t.id,
            title: t.title,
            notes: t.notes,
            date: t.date
        };
    }

    findTastings(): Promise<TastingDto[]> {
        const tastings = this.Tasting.findAll();
        return tastings.then(ts => ts.map(t => this.toTastingDto(t)));
    }

    async getTasting(id: number): Promise<TastingDto | null> {
        const tasting = await this.Tasting.findByPk(id);

        if (!tasting) {
            return null;
        }

        return this.toTastingDto(tasting);
    }


}