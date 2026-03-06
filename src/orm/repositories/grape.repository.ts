import {ModelStatic} from "sequelize";
import {GrapeAttributes, GrapeColor, GrapeCreateDto, GrapeDto, GrapeInstance} from "../../types/grape";

export class GrapeRepository {
    constructor(private readonly Grape: ModelStatic<GrapeInstance>) {}

    async findAll(): Promise<GrapeDto[]> {
        const grapes = await this.Grape.findAll();
        return grapes.map(g => (this.toGrapeDto(g)));
    }

    async create(grape: GrapeCreateDto): Promise<GrapeDto> {
        const created = await this.Grape.create(grape);
        return this.toGrapeDto(created);
    }

    async update(id: number, grape: GrapeCreateDto): Promise<void> {
        const existing = await this.Grape.findByPk(id);

        if (!existing) {
            throw new Error(`Grape with id ${id} not found`);
        }

        await existing.update({
            name: grape.name,
            color: grape.color
        });
    }

    delete(id: number) {
        return this.Grape.destroy({where: {id: id}})
    }

    async findById(id: number): Promise<GrapeDto | null>  {
        const grape = await this.Grape.findByPk(id);
        if (!grape) {
            return null;
        }

        return this.toGrapeDto(grape);
    }

    patchGrapeByNameAndColor(from: GrapeAttributes, to: GrapeAttributes) {

        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-update

        return this.Grape.update(
            {name: to.name, color: to.color},
            {where: {name: from.name}}
        );
    }


    private toGrapeDto(grape: GrapeInstance): GrapeDto {
        return {
            id: grape.id,
            name: grape.name,
            color: grape.color as GrapeColor
        };
    }

}