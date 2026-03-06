import {CountryDto, CountryInstance, CountryWithWines} from "../../types/country";
import {ModelStatic} from "sequelize";
import {WineInstance} from "../../types/wine";

export class CountryRepository {

    constructor(
        private readonly Country: ModelStatic<CountryInstance>,
        private readonly Wine: ModelStatic<WineInstance>
    ) {}

    /**
     * Return all countries in the database.
     */
    async findAll(): Promise<CountryDto[]> {
        const countries = await this.Country.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']], // sortera alfabetiskt
            include: [
                {
                    model: this.Wine,
                    as: 'wines',
                    attributes: ['id'],
                    required: false,
                }
            ]
        }) as CountryWithWines[];

        return countries.map(c => ({
            id: c.id,
            name: c.name,
            isUsed: c.wines?.length > 0
        }));
    }

    async create(country): Promise<CountryDto> {
        const created = await this.Country.create(country);
        return {
            id: created.id,
            name: created.name,
            isUsed: false
        };
    }

    async delete(id: number) {
        const country: CountryWithWines = await this.Country.findByPk(id, {
            include: [{ model: this.Wine, as: 'wines', attributes: ['id'], required: false }]
        });

        if (!country) {
            return 'not_found';
        }
        if (country.wines?.length > 0) {
            return 'in_use';
        }

        await this.Country.destroy({where: {id: id}})
        return 'deleted';
    }


    private toCountryDto(c: CountryWithWines): CountryDto {
        return {
            id: c.id,
            name: c.name,
            isUsed: c.wines?.length > 0
        };
    }

}