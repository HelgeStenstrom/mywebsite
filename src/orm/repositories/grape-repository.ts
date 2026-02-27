import {ModelStatic} from "sequelize";
import {GrapeAttributes, GrapeColor, GrapeCreate, GrapeDto, GrapeInstance} from "../../types/grape";

export class GrapeRepository {
    constructor(private Grape: ModelStatic<GrapeInstance>) {}

    findGrapes(): Promise<GrapeDto[]> {
        return this.Grape.findAll()
            .then(grapes =>
                grapes.map(g => ({
                    id: g.id,
                    name: g.name,
                    color: g.color  as 'blå' | 'grön' | null
                }))
            );
    }

    async postGrape(grape: GrapeCreate): Promise<GrapeDto> {
        const created = await this.Grape.create(grape);
        return this.toGrapeDto(created);
    }

    async putGrape(id: number, grape: GrapeCreate): Promise<void> {
        const existing = await this.Grape.findByPk(id);

        if (!existing) {
            throw new Error(`Grape with id ${id} not found`);
        }

        await existing.update({
            name: grape.name,
            color: grape.color
        });
    }

    delGrape(name: string) {

        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-destroy
        return this.Grape.destroy({
            where: {name: name}
        });
    }

    delGrapeById(id: number) {
        return this.Grape.destroy({where: {id: id}})
    }

    async getGrape(id: number): Promise<GrapeDto | null>  {
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