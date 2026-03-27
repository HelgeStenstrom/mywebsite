import {ModelStatic, Sequelize} from "sequelize";
import {
    WineTastingInstance,
    WineTastingWineCreateDto,
    WineTastingWineInstance,
    WineTastingWineUpdateDto
} from "../../types/wine-tasting";
import {WineTastingWineRepository} from "../../orm/repositories/wine-tasting-wine.repository";
import {defineTasting} from "../../orm/models/tasting.model";
import {defineWineTastingWine} from "../../orm/models/wine-tasting-wine.model";
import {connectTastingAndTastingWine} from "../../orm";
import {WineInstance} from "../../types/wine";
import {defineWine} from "../../orm/models/wine.model";
import {defineScore} from "../../orm/models/score.model";
import {ScoreInstance} from "../../types/score";

describe('WineTastingWineRepository', () => {

    let sequelize: Sequelize;
    let tastingDefinition: ModelStatic<WineTastingInstance>;
    let wineDefinition: ModelStatic<WineInstance>;
    let wineTastingWineDefinition: ModelStatic<WineTastingWineInstance>;
    let scoreDefinition: ModelStatic<ScoreInstance>;

    let repository: WineTastingWineRepository;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite" ,  logging: false });

        tastingDefinition = defineTasting(sequelize);
        wineDefinition = defineWine(sequelize);
        wineTastingWineDefinition = defineWineTastingWine(sequelize);
        scoreDefinition = defineScore(sequelize);
        connectTastingAndTastingWine(tastingDefinition, wineTastingWineDefinition);

        await sequelize.sync({ force: true });

        repository = new WineTastingWineRepository(wineTastingWineDefinition, scoreDefinition);
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
            scoreStdDev: null,
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
            scoreStdDev: null,
        });
    });

    test('updatePositions updates position for each tasting wine', async () => {
        const tasting = await tastingDefinition.create({
            title: 'Testprovning',
            notes: '',
            tastingDate: new Date('2024-01-01'),
        });

        const wine1 = await wineDefinition.create({ name: 'Vin 1', countryId: 1, wineTypeId: 1, isNonVintage: false });
        const wine2 = await wineDefinition.create({ name: 'Vin 2', countryId: 1, wineTypeId: 1, isNonVintage: false });

        const created1 = await repository.create(tasting.id, { wineId: wine1.id, position: 1 });
        const created2 = await repository.create(tasting.id, { wineId: wine2.id, position: 2 });

        await repository.updatePositions(tasting.id, [
            { id: created1.id, position: 2 },
            { id: created2.id, position: 1 },
        ]);

        const result = await repository.findByTastingId(tasting.id);
        const pos = new Map(result.map(w => [w.id, w.position]));

        expect(pos.get(created1.id)).toBe(2);
        expect(pos.get(created2.id)).toBe(1);
    });

    describe('statistics', () => {

        test('findByTastingId returns averageScore and scoreStdDev calculated from scores', async () => {
            const tasting = await tastingDefinition.create({
                title: 'Test tasting',
                notes: '',
                tastingDate: new Date('2024-01-01'),
            });

            await repository.create(tasting.id, { wineId: 1, position: 1 });

            await scoreDefinition.bulkCreate([
                { tastingId: tasting.id, memberId: 1, position: 1, score: 10 },
                { tastingId: tasting.id, memberId: 2, position: 1, score: 20 },
            ]);

            const result = await repository.findByTastingId(tasting.id);

            expect(result[0].averageScore).toBeCloseTo(15);
            expect(result[0].scoreStdDev).toBeCloseTo(5);
        });

        test('findByTastingId returns null averageScore and scoreStdDev when no scores exist', async () => {
            const tasting = await tastingDefinition.create({
                title: 'Test tasting',
                notes: '',
                tastingDate: new Date('2024-01-01'),
            });

            await repository.create(tasting.id, { wineId: 1, position: 1 });

            const result = await repository.findByTastingId(tasting.id);

            expect(result[0].averageScore).toBeNull();
            expect(result[0].scoreStdDev).toBeNull();
        });

        test('findByTastingId falls back to stored averageScore when no scores exist', async () => {
            const tasting = await tastingDefinition.create({
                title: 'Test tasting',
                notes: '',
                tastingDate: new Date('2024-01-01'),
            });

            await repository.create(tasting.id, { wineId: 1, position: 1, averageScore: 13.5 });

            const result = await repository.findByTastingId(tasting.id);

            expect(result[0].averageScore).toBeCloseTo(13.5);
            expect(result[0].scoreStdDev).toBeNull();
        });

        test('findByTastingId uses scores over stored averageScore when both exist', async () => {
            const tasting = await tastingDefinition.create({
                title: 'Test tasting',
                notes: '',
                tastingDate: new Date('2024-01-01'),
            });

            await repository.create(tasting.id, { wineId: 1, position: 1, averageScore: 13.5 });

            await scoreDefinition.bulkCreate([
                { tastingId: tasting.id, memberId: 1, position: 1, score: 10 },
                { tastingId: tasting.id, memberId: 2, position: 1, score: 20 },
            ]);

            const result = await repository.findByTastingId(tasting.id);

            expect(result[0].averageScore).toBeCloseTo(15);
            expect(result[0].scoreStdDev).toBeCloseTo(5);
        });
    })

});