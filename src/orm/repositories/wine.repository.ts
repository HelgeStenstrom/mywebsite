import {ModelStatic} from "sequelize";
import {WineCreateDto, WineDto, WineGrapeInstance, WineInstance} from "../../types/wine";
import {CountryInstance} from "../../types/country";
import {WineTypeInstance} from "../../types/wine-type";
import {WineTastingInstance, WineTastingWineInstance} from "../../types/wine-tasting";

export class WineRepository {

    constructor(
        private readonly Wine: ModelStatic<WineInstance>,
        private readonly Country: ModelStatic<CountryInstance>,
        private readonly WineType: ModelStatic<WineTypeInstance>,
        private readonly WineTastingWine: ModelStatic<WineTastingWineInstance>,
        private readonly WineGrape: ModelStatic<WineGrapeInstance>,
        private readonly Tasting: ModelStatic<WineTastingInstance>,
    ) {}

    async create(param: WineCreateDto): Promise<WineDto> {
        const created = await this.Wine.create({
            name: param.name,
            countryId: param.countryId,
            wineTypeId: param.wineTypeId,
            systembolaget: param.systembolaget,
            volume: param.volume,
            vintageYear: param.isNonVintage ? null : (param.vintageYear ?? null),
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

    async findById(id: number): Promise<WineDto | null> {

        const withIncludes = await this.Wine.findByPk(id, {
            include: [
                {
                    model: this.Country,
                    as: 'countryModel',
                },
                {
                    model: this.WineType,
                    as: 'winetypeModel',
                },

                {
                    model: this.WineTastingWine,
                    as: 'wineTastingWines'
                },
                {model: this.WineGrape, as: 'wineGrapes'},
            ]
        });
        if (!withIncludes) {
            return null;
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
                    },
                    {
                        model: this.WineTastingWine,
                        as: 'wineTastingWines',
                        attributes: ['id'],
                        required: false,
                        include: [{
                            model: this.Tasting,
                            as: 'wineTasting',
                            attributes: ['tastingDate'],
                            required: false,
                        }]
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
            grapes: (w.wineGrapes ?? []).map(g => ({
                id: g.id,
                wineId: g.wineId,
                grapeId: g.grapeId,
                percentage: g.percentage ?? null,
            })),
            volume: w.volume,
            vintageYear: w.vintageYear ?? null,
            isNonVintage: w.isNonVintage ?? false,
            createdAt: w.createdAt,
            wineType: w.winetypeModel ?? { id: 0, name: '', isUsed: false },
            country: w.countryModel ?? { id: 0, name: '', isUsed: false },
            isUsed: (w.wineTastingWines?.length ?? 0) > 0,
            lastTasted: w.wineTastingWines && w.wineTastingWines.length > 0
                ? w.wineTastingWines
                .map(wtw => wtw.wineTasting?.tastingDate)
                .filter(Boolean)
                .sort((a, b) => a > b ? -1 : 1)[0] ?? null
                : null,
        };
    }

    async delete(id: number) {
        const wine = await this.Wine.findByPk(id, {
            include: [{
                model: this.WineTastingWine,
                as: 'wineTastingWines',
                attributes: ['id'],
                required: false
            }]
        });

        if (!wine) {
            return 'not_found';
        }

        if ((wine.wineTastingWines?.length ?? 0) > 0) {
            return 'in_use';
        }

        await this.Wine.destroy({
            where: {id: id}
        });
        return 'deleted';
    }

    async update(id: number, wine: WineCreateDto): Promise<WineDto | null> {
        const { id: _ignored, ...safeData } = wine as any;
        await this.Wine.update(safeData, {where: {id}})

        const updated = await this.Wine.findByPk(id);
        if (!updated) {
            return null;
        }
        return this.toWineDto(updated);
    }
}