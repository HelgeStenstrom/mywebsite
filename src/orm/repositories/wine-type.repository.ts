import {ModelStatic} from "sequelize";
import {WineTypeDto, WineTypeInstance, WineTypeWithWines} from "../../types/wine-type";
import {CountryWithWines} from "../../types/country";
import {WineInstance} from "../../types/wine";

export class WineTypeRepository {

    constructor(
        private readonly WineType: ModelStatic<WineTypeInstance>,
        private readonly Wine: ModelStatic<WineInstance>,
    ) {}


    async findAll(): Promise<WineTypeDto[]> {
        const models = await this.WineType.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
            include: [
                {
                    model: this.Wine,
                    as: 'wines',
                    attributes: ['id'],
                    required: false
                }
            ]
        }) as WineTypeWithWines[];

        return models.map(t => ({
            id: t.id,
            name: t.name,
            isUsed: t.wines?.length > 0
        }));
    }

    async create(param: { name: string }) {
        return this.WineType.create(param);
    }

    async delete(id: number) {
        const wineType: CountryWithWines = await this.WineType.findByPk(id, {
            include: [{ model: this.Wine, as: 'wines', attributes: ['id'], required: false }]
        });

        if (!wineType) {
            return 'not_found';
        }
        if (wineType.wines?.length > 0) {
            return 'in_use';
        }

        await this.WineType.destroy({where: {id: id}})
        return 'deleted';
    }

}