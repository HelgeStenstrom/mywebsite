import {ModelStatic, Sequelize} from "sequelize";
import {WineGrapeCreateDto, WineGrapeInstance, WineInstance} from "../../types/wine";
import {WineGrapeRepository} from "../../orm/repositories/wine-grape.repository";
import {defineWine} from "../../orm/models/wine.model";
import {defineWineGrape} from "../../orm/models/wine-grape.model";
import {connectWineAndWineGrape} from "../../orm";

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

    test('delete removes the wine grape', async () => {
        const wine = await wineDefinition.create({
            name: 'Testvin',
            countryId: 1,
            wineTypeId: 1,
            isNonVintage: false,
        });


        const created = await repository.create(wine.id, { grapeId: 1, percentage: 50 });
        const deleted = await repository.delete(created.id);
        const result = await repository.findByWineId(wine.id);

        expect(deleted).toBe('deleted');
        expect(result).toHaveLength(0);
    });

    test('delete returns false when wine grape does not exist', async () => {
        const result = await repository.delete(9999);

        expect(result).toBe('not_found');
    });

    test('more complicated delete, with several wines and grapes', async () => {
        const wine1 = await wineDefinition.create({
            name: 'Testvin 1',
            countryId: 1,
            wineTypeId: 1,
            isNonVintage: false,
        });
        const wine2 = await wineDefinition.create({
            name: 'Testvin 2',
            countryId: 1,
            wineTypeId: 1,
            isNonVintage: false,
        });

        // We probably don't need any actual grapes; the wineGrapes can refer to grapes that don't exist
        // const grape11 = await wineGrapeDefinition.create({
        //     wineId: wine1.id,
        //     grapeId: 1,
        // });

        const grape11 = await repository.create(wine1.id, { grapeId: 1});
        const grape12 = await repository.create(wine1.id, { grapeId: 2});
        const grape21 = await repository.create(wine2.id, { grapeId: 1});
        const grape22 = await repository.create(wine2.id, { grapeId: 2});



        // We now have two wines with two grapes each
        const wineGrapes1 = await repository.findByWineId(wine1.id);
        expect(wineGrapes1).toHaveLength(2);
        const wineGrapes2 = await repository.findByWineId(wine2.id);
        expect(wineGrapes2).toHaveLength(2);

        // Now delete some grapes.

        await repository.delete(grape11.id);
        // This should remove one row from the table of wineGrapes
        const wineGrapes1AfterDelete = await repository.findByWineId(wine1.id);
        expect(wineGrapes1AfterDelete).toHaveLength(1);
        expect(wineGrapes1AfterDelete[0].grapeId).toEqual(2);

        // This should not remove any wineGrapes from wine2
        const wineGrapes2AfterDelete = await repository.findByWineId(wine2.id);
        expect(wineGrapes2AfterDelete).toHaveLength(2);
    });

});