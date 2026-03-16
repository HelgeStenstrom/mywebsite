import {ModelStatic, Sequelize} from "sequelize";
import {WineGrapeCreateDto, WineGrapeInstance, WineInstance} from "../types/wine";
import {WineGrapeRepository} from "../orm/repositories/wine-grape.repository";
import {defineWine} from "../orm/models/wine.model";
import {defineWineGrape} from "../orm/models/wine-grape.model";
import {connectWineAndWineGrape} from "../orm";

describe('WineGrapeRepository', () => {

    let sequelize: Sequelize;
    let wineDefinition: ModelStatic<WineInstance>;
    let wineGrapeDefinition: ModelStatic<WineGrapeInstance>;
    let repository: WineGrapeRepository;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: 'sqlite', logging: false});

        wineDefinition = defineWine(sequelize);
        wineGrapeDefinition = defineWineGrape(sequelize);
        connectWineAndWineGrape(wineDefinition, wineGrapeDefinition);

        await sequelize.sync({force: true});

        repository = new WineGrapeRepository(wineGrapeDefinition);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('create and findByWineId returns the created wine grape', async () => {
        const wine = await wineDefinition.create({
            name: 'Testvin',
            countryId: 1,
            wineTypeId: 1,
            isNonVintage: false,
        });

        const toCreate: WineGrapeCreateDto = {
            grapeId: 1,
            percentage: 75.5,
        };

        await repository.create(wine.id, toCreate);
        const result = await repository.findByWineId(wine.id);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: expect.any(Number),
            wineId: wine.id,
            grapeId: 1,
            percentage: 75.5,
        });
    });

    test('create without percentage returns null for percentage', async () => {
        const wine = await wineDefinition.create({
            name: 'Testvin',
            countryId: 1,
            wineTypeId: 1,
            isNonVintage: false,
        });

        const toCreate: WineGrapeCreateDto = {
            grapeId: 1,
        };

        await repository.create(wine.id, toCreate);
        const result = await repository.findByWineId(wine.id);

        expect(result[0].percentage).toBeNull();
    });
});