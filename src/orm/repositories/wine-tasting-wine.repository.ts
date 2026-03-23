import {
    WineTastingWineCreateDto,
    WineTastingWineDto,
    WineTastingWineInstance,
    WineTastingWineUpdateDto
} from "../../types/wine-tasting";
import {ModelStatic} from "sequelize";

export class WineTastingWineRepository {

    constructor(
        private readonly WineTastingWine: ModelStatic<WineTastingWineInstance>,
    ) {
    }

    async create(
        wineTastingId: number,
        wine: WineTastingWineCreateDto,
    ):  Promise<WineTastingWineDto>  {

        const created = await this.WineTastingWine.create({
            wineTastingId: wineTastingId,
            wineId: wine.wineId,
            position: wine.position,
            purchasePrice: wine.purchasePrice ?? null,
            averageScore: wine.averageScore ?? null,
        })

        return this.toDto(created);
    }

    async findByTastingId(
        wineTastingId: number,
    ): Promise<WineTastingWineDto[]> {

        const wines = await this.WineTastingWine.findAll({
            where: {wineTastingId: wineTastingId},
        })

        return wines.map(this.toDto);
    }

    private toDto(created: WineTastingWineInstance): WineTastingWineDto {
        return {
            id: created.id,
            wineId: created.wineId,
            position: created.position,
            purchasePrice: created.purchasePrice ?? null,
            averageScore: created.averageScore ?? null,
        }

    }

    async delete(wineTastingId: number, tastingWineId: number) {
        const existing = await this.WineTastingWine.findOne({ where: { id: tastingWineId, wineTastingId } });
        if (!existing) {
            return 'not_found';
        }
        const number = await this.WineTastingWine.destroy({where: {id: tastingWineId}});
        if (number === 0) {
            return 'not_found';
        }
        return 'deleted'
    }

    async update(id: number, toUpdate: WineTastingWineUpdateDto) {
        const {wineId, position, purchasePrice, averageScore} = toUpdate;
        await this.WineTastingWine.update(
            {wineId, position, purchasePrice, averageScore},
            {where: {id}});

        const updated = await this.WineTastingWine.findByPk(id);
        if (!updated) {
            throw new Error('WineTastingWine not found');
        }
        return this.toDto(updated);
    }
}