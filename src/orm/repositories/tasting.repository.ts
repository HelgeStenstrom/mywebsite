import {TastingInstance, WineTastingCreate, WineTastingDto} from "../../types/wine-tasting";
import {ModelStatic} from "sequelize";
import {BadRequestError} from "../../errors/bad-request-error";

export class TastingRepository {
    constructor(private readonly Tasting: ModelStatic<TastingInstance>) {}

    async postTasting(t: WineTastingCreate): Promise<WineTastingDto> {
        if (!t.title || !t.notes || !t.tastingDate) {
            throw new BadRequestError('Missing required fields: title, notes, tastingDate');
        }
        const toCreate = {
            title: t.title,
            notes: t.notes,
            tastingDate: t.tastingDate,
        };
        const created = await this.Tasting.create(toCreate);
        return this.toTastingDto(created);
    }

    private toTastingDto(t: TastingInstance): WineTastingDto {
        return {
            id: t.id,
            title: t.title,
            notes: t.notes,
            tastingDate: t.tastingDate,
            hosts: [],
        };
    }

    findTastings(): Promise<WineTastingDto[]> {
        const tastings = this.Tasting.findAll();
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