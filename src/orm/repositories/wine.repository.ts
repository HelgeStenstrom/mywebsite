import {ModelStatic} from "sequelize";
import {WineCreateDto, WineDto, WineInstance} from "../../types/wine";
import {CountryInstance} from "../../types/country";
import {WineTypeInstance} from "../../types/wine-type";

export class WineRepository {

    constructor(
        private Wine: ModelStatic<WineInstance>,
        private Country: ModelStatic<CountryInstance>,
        private WineType: ModelStatic<WineTypeInstance>,
    ) {}


    async postWine(param: WineCreateDto) {
        return this.Wine.create({
            name: param.name,
            countryId: param.countryId,
            wineTypeId: param.wineTypeId,
            systembolaget: param.systembolaget,
            volume: param.volume,
            vintageYear: param.vintageYear,
            isNonVintage: param.isNonVintage
        });
    }

    async findWines(): Promise<WineDto[]> {
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


    async delWineById(id: number) {
        return this.Wine.destroy({
            where: {id: id}
        });
    }
}