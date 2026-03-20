import {ModelStatic} from "sequelize";
import {WineGrapeCreateDto, WineGrapeDto, WineGrapeInstance} from "../../types/wine";

export class WineGrapeRepository {

    constructor(
        private readonly WineGrape: ModelStatic<WineGrapeInstance>,
    ) {}

    async create(wineId: number, grape: WineGrapeCreateDto): Promise<WineGrapeDto> {
        const created = await this.WineGrape.create({
            wineId,
            grapeId: grape.grapeId,
            percentage: grape.percentage ?? null,
        });
        return this.toDto(created);
    }

    async findByWineId(wineId: number): Promise<WineGrapeDto[]> {
        const grapes = await this.WineGrape.findAll({
            where: {wineId},
        });
        return grapes.map(g => this.toDto(g));
    }

    private toDto(wineGrape: WineGrapeInstance): WineGrapeDto {
        return {
            id: wineGrape.id,
            wineId: wineGrape.wineId,
            grapeId: wineGrape.grapeId,
            percentage: wineGrape.percentage ?? null,
        };
    }

    async delete(id: number) {
        const number = await this.WineGrape.destroy({where: {id: id}});
        if (number === 0) {
            return 'not_found';
        }
        return 'deleted';
    }
}