import {ModelStatic, Sequelize} from "sequelize";
import {
    WineTastingInstance,
    WineTastingWineCreateDto,
    WineTastingWineInstance,
    WineTastingWineUpdateDto
} from "../types/wine-tasting";
import {WineTastingWineRepository} from "../orm/repositories/wine-tasting-wine.repository";
import {defineTasting} from "../orm/models/tasting.model";
import {defineWineTastingWine} from "../orm/models/wine-tasting-wine.model";
import {connectTastingAndTastingWine} from "../orm";
import {WineInstance} from "../types/wine";
import {defineWine} from "../orm/models/wine.model";

describe('WineTastingWineRepository', () => {

    let sequelize: Sequelize;
    let tastingDefinition: ModelStatic<WineTastingInstance>;
    let wineDefinition: ModelStatic<WineInstance>;
    let wineTastingWineDefinition: ModelStatic<WineTastingWineInstance>;
    let repository: WineTastingWineRepository;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite" ,  logging: false });

        tastingDefinition = defineTasting(sequelize);
        wineDefinition = defineWine(sequelize);
        wineTastingWineDefinition = defineWineTastingWine(sequelize);
        connectTastingAndTastingWine(tastingDefinition, wineTastingWineDefinition);

        await sequelize.sync({ force: true });

        repository = new WineTastingWineRepository(wineTastingWineDefinition);
    })

    afterEach(async () => {
        await sequelize.close();
    });

    test('create and findByTastingId returns the created wine', async () => {
        const tasting = await tastingDefinition.create({
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: new Date('2023-07-20'),
        });

        const toCreate: WineTastingWineCreateDto = {
            wineId: 0,
            position: 0,
            purchasePrice: 129,
            averageScore: 12.3,
        }

        await repository.create(tasting.id, toCreate);
        const result = await repository.findByTastingId(tasting.id);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: expect.any(Number),
            wineId: 0,
            position: 0,
            purchasePrice: 129,
            averageScore: 12.3,
        })
    })

    test('delete removes the tasting wine', async () => {

        // Setup
        const tasting = await tastingDefinition.create({
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: new Date('2023-07-20'),
        });

        const wine = await wineDefinition.create({
            name: 'Testvin',
            countryId: 1,
            wineTypeId: 1,
            isNonVintage: false,
        });

        const created = await repository.create(tasting.id, { wineId: wine.id, position: 1 });

        // Exercise
        const deleted = await repository.delete(tasting.id, created.id);

        // Verify
        expect(deleted).toBe('deleted');
        const result = await repository.findByTastingId(1);

        expect(result).toHaveLength(0);
    });

    test('delete returns "not_found" when tasting wine does not exist', async () => {
        const result = await repository.delete(42, 9999);

        expect(result).toBe('not_found');
    });

    test('update modifies and returns the updated tasting wine', async () => {
        const tasting = await tastingDefinition.create({
            title: 'Testprovning',
            notes: '',
            tastingDate: new Date('2024-01-01'),
        });

        const wine1 = await wineDefinition.create({
            name: 'Testvin',
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

        const created = await repository.create(tasting.id, { wineId: wine1.id, position: 1 });

        const toUpdate: WineTastingWineUpdateDto = {wineId: wine2.id,  position: 3, averageScore: 14.5, purchasePrice: 199 };

        const updated = await repository.update(created.id, toUpdate);

        expect(updated).toEqual({
            id: created.id,
            wineId: wine2.id,
            position: 3,
            purchasePrice: 199,
            averageScore: 14.5,
        });
    });

});