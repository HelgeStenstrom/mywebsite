import {ModelStatic} from "sequelize";
import {WineDto, WineInstance} from "../../types/wine";
import {CountryInstance} from "../../types/country";
import {WineTypeInstance} from "../../types/wine-type";

export class WineRepository {

    constructor(
        private Wine: ModelStatic<WineInstance>,
        private Country: ModelStatic<CountryInstance>,
        private WineType: ModelStatic<WineTypeInstance>,
    ) {}


    async postWine(param: {
        country: number; name: string; systembolaget: number; volume: number; winetype: number
    }) {
        return this.Wine.create(param);
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
            createdAt: w.createdAt,
            wineType: w.winetypeModel ?? { id: 0, name: '', isUsed: false },
            country: w.countryModel ?? { id: 0, name: '', isUsed: false }
        };
    }


    async delWineById(id: number) {
        return this.Wine.destroy({
            where: {id: id}
        });
    }
}