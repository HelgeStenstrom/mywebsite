import {ModelStatic} from "sequelize";
import {WineCreateDto, WineDto, WineInstance} from "../../types/wine";
import {CountryInstance} from "../../types/country";
import {WineTypeInstance} from "../../types/wine-type";

export class WineRepository {

    constructor(
        private readonly Wine: ModelStatic<WineInstance>,
        private readonly Country: ModelStatic<CountryInstance>,
        private readonly WineType: ModelStatic<WineTypeInstance>,
    ) {}


    async create(param: WineCreateDto): Promise<WineDto> {
        const created = await this.Wine.create({
            name: param.name,
            countryId: param.countryId,
            wineTypeId: param.wineTypeId,
            systembolaget: param.systembolaget,
            volume: param.volume,
            vintageYear: param.vintageYear?? null,
            isNonVintage: param.isNonVintage ?? false,
        });

        const withIncludes = await this.Wine.findByPk(created.id, {
            include: [
                {
                    model: this.WineType,
                    as: 'winetypeModel',
                    attributes: ['id', 'name'],
                    required: true
                },
                {
                    model: this.Country,
                    as: 'countryModel',
                    attributes: ['id', 'name'],
                }
            ]
        });
        if (!withIncludes) {
            throw new Error(`Wine with id ${created.id} not found after create`);
        }
        const plain = withIncludes.get({ plain: true });
        return this.toWineDto(plain as WineInstance);
    }

    async findAll(): Promise<WineDto[]> {
        const wines = await this.Wine.findAll(
            {
                include: [
                    {
                        model: this.WineType,
                        as: 'winetypeModel',
                        attributes: ['id', 'name'],
                        required: true
                    },
                    {
                        model: this.Country,
                        as: 'countryModel',
                        attributes: ['id', 'name'],
                        required: true
                    }
                ]
            }
        );
        return wines.map(this.toWineDto);
    }

    private toWineDto(w: WineInstance): WineDto {
        return {
            id: w.id,
            name: w.name,
            systembolaget: w.systembolaget,
            volume: w.volume,
            vintageYear: w.vintageYear ?? null,
            isNonVintage: w.isNonVintage ?? false,
            createdAt: w.createdAt,
            wineType: w.winetypeModel ?? { id: 0, name: '', isUsed: false },
            country: w.countryModel ?? { id: 0, name: '', isUsed: false },
        };
    }


    async delete(id: number) {
        return this.Wine.destroy({
            where: {id: id}
        });
    }
}