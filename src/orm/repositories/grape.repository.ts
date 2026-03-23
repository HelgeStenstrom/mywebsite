import {ModelStatic} from "sequelize";
import {GrapeColor, GrapeCreateDto, GrapeDto, GrapeInstance} from "../../types/grape";
import {WineGrapeInstance} from "../../types/wine";

export class GrapeRepository {
    constructor(
        private readonly Grape: ModelStatic<GrapeInstance>,
        private readonly WineGrape: ModelStatic<WineGrapeInstance>
    ) {
    }

    async findAll(): Promise<GrapeDto[]> {
        const grapes = await this.Grape.findAll();
        return Promise.all(grapes.map(g => this.toGrapeDto(g)));
    }

    async create(grape: GrapeCreateDto): Promise<GrapeDto> {
        const created = await this.Grape.create(grape);
        return this.toGrapeDto(created);
    }


    async update(id: number, grape: GrapeCreateDto): Promise<GrapeDto | null> {
        const {id: _ignored, ...safeData} = grape as any;
        await this.Grape.update(safeData, {where: {id}});

        const updated = await this.Grape.findByPk(id);
        if (!updated) {
            return null;
        }
        return this.toGrapeDto(updated);
    }

    delete(id: number) {
        return this.Grape.destroy({where: {id: id}})
    }

    async findById(id: number): Promise<GrapeDto | null> {
        const grape = await this.Grape.findByPk(id);
        if (!grape) {
            return null;
        }

        return this.toGrapeDto(grape);
    }


    private async toGrapeDto(grape: GrapeInstance): Promise<GrapeDto> {
        const count = await this.WineGrape.count({where: {grapeId: grape.id}});

        return {
            id: grape.id,
            name: grape.name,
            color: grape.color as GrapeColor,
            isUsed: count > 0,
        };
    }

}