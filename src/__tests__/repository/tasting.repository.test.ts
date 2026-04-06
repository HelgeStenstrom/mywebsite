import {ModelStatic, Sequelize} from 'sequelize';
import {defineTasting} from '../../orm/models/tasting.model';
import {TastingRepository} from '../../orm/repositories/tasting.repository';
import {defineWineTastingHost} from "../../orm/models/wine-tasting-host.model";
import {defineMember} from "../../orm/models/member.model";
import {
    connectTastingAndScore,
    connectTastingAndTastingHost,
    connectTastingAndTastingWine,
    connectWineAndWineTastingWine
} from "../../orm";
import {WineTastingHostInstance, WineTastingInstance, WineTastingWineInstance} from "../../types/wine-tasting";
import {MemberInstance} from "../../types/member";
import {defineWineTastingWine} from "../../orm/models/wine-tasting-wine.model";
import {ScoreInstance} from "../../types/score";
import {defineScore} from "../../orm/models/score.model";
import {WineInstance} from "../../types/wine";
import {defineWine} from "../../orm/models/wine.model";

describe('TastingRepository', () => {
    let sequelize: Sequelize;
    let tastingRepository: TastingRepository;
    let wineTastingDefinition: ModelStatic<WineTastingInstance>;
    let wineTastingHostDefinition: ModelStatic<WineTastingHostInstance>;
    let wineTastingWineDefinition: ModelStatic<WineTastingWineInstance>;
    let memberDefinition: ModelStatic<MemberInstance>;
    let scoreDefinition: ModelStatic<ScoreInstance>;
    let wineDefinition: ModelStatic<WineInstance>;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite", logging: false});

        wineTastingDefinition = defineTasting(sequelize);
        wineTastingHostDefinition = defineWineTastingHost(sequelize);
        memberDefinition = defineMember(sequelize);
        wineTastingWineDefinition = defineWineTastingWine(sequelize);
        scoreDefinition = defineScore(sequelize);
        wineDefinition = defineWine(sequelize);

        connectTastingAndTastingHost(wineTastingDefinition, memberDefinition, wineTastingHostDefinition,);
        connectTastingAndTastingWine(wineTastingDefinition, wineTastingWineDefinition);
        connectTastingAndScore(wineTastingDefinition, scoreDefinition);
        connectWineAndWineTastingWine(wineDefinition, wineTastingWineDefinition);

        await sequelize.sync({force: true});

        tastingRepository = new TastingRepository(
            wineTastingDefinition,
            wineTastingHostDefinition,
            memberDefinition,
            wineTastingWineDefinition,
            scoreDefinition,
            wineDefinition,);

    });

    afterEach(async () => {
        await sequelize.close();
    });

    async function createWine(wineId?: number): Promise<WineInstance> {
        return wineDefinition.create({
            id: wineId,
            name: 'Château Vadeau',
            countryId: 1,
            wineTypeId: 1,
        });
    }

    it('returns WineTastingDto with an empty hosts array', async () => {
        // arrange
        await wineTastingDefinition.create({
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: new Date('2023-07-20'),
        });

        // act
        const result = await tastingRepository.findAll();

        // assert
        expect(result).toHaveLength(1);

        expect(result[0]).toEqual({
            id: expect.any(Number),
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: '2023-07-20',
            hosts: [],
            winningWines: [],
        });
    });

    test('returns WineTastingDto with hosts when hosts exist', async () => {
        // arrange
        const member = await memberDefinition.create({
            given: 'Helge',
            surname: 'Stenström',
        });

        const tasting = await wineTastingDefinition.create({
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: new Date('2023-07-20'),
        });

        await wineTastingHostDefinition.create({
            wineTastingId: tasting.id,
            memberId: member.id,
        });

        // act
        const result = await tastingRepository.findAll();

        // assert
        expect(result).toHaveLength(1);

        expect(member.id).toEqual(1);

        expect(result[0]).toEqual({
            id: expect.any(Number),
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: '2023-07-20',
            hosts: [{memberId: member.id}],
            winningWines: [],
        });
    });

    test('it returns hosts when fetching tastings', async () => {

        // Setup
        const tasting = await wineTastingDefinition.create({
            title: 'Testprovning',
            notes: 'Testanteckningar',
            tastingDate: new Date('2024-01-01'),
        });

        const member = await memberDefinition.create({
            given: 'Helge',
            surname: 'Stenström',
        })

        await wineTastingHostDefinition.create({
            wineTastingId: tasting.id,
            memberId: member.id,
        })

        // Exercise
        const result = await tastingRepository.findAll();

        // Verify
        expect(result).toHaveLength(1);
        expect(result[0].hosts).toHaveLength(1);
        expect(result[0].hosts[0].memberId).toEqual(member.id);
    })

    describe('Scores', () => {
        test('findById returns wines with dynamically calculated averageScore', async () => {
            const tasting = await wineTastingDefinition.create({
                title: 'Testprovning',
                notes: '',
                tastingDate: new Date('2024-01-01'),
            });

            const wine = await createWine();
            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: wine.id,
                position: 1,
            });

            await scoreDefinition.bulkCreate([
                { tastingId: tasting.id, memberId: 1, position: 1, score: 10 },
                { tastingId: tasting.id, memberId: 2, position: 1, score: 20 },
            ]);

            const result = await tastingRepository.findById(tasting.id);

            expect(result?.wines?.[0].averageScore).toBeCloseTo(15);
        });

        test('returns the winning wine when average score is stored as a decimal string', async () => {
            // arrange
            const tasting = await wineTastingDefinition.create({
                title: 'Test tasting',
                notes: 'Some notes',
                tastingDate: new Date('2023-07-20'),
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 1,
                averageScore: 13.40,
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 2,
                averageScore: 12.00,
            });

            // act
            const result = await tastingRepository.findAll();

            // assert
            expect(result[0].winningWines).toHaveLength(1);
            expect(result[0].winningWines[0].wineId).toBe(1);
            expect(result[0].winningWines[0].averageScore).toBe(13.40);
        });

        test('returns the winning wine when average score is a decimal string', async () => {
            // arrange
            const tasting = await wineTastingDefinition.create({
                title: 'Test tasting',
                notes: 'Some notes',
                tastingDate: new Date('2023-07-20'),
            });

            const wine1 = await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 1,
                averageScore: 13.40,
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 2,
                averageScore: 12.00,
            });

            // Simulate MariaDB returning DECIMAL as string
            jest.spyOn(wine1, 'get').mockReturnValue('13.40' as any);
            (wine1 as any).averageScore = '13.40';

            // act
            const result = await tastingRepository.findAll();

            // assert
            expect(result[0].winningWines).toHaveLength(1);
            expect(result[0].winningWines[0].wineId).toBe(1);
        });

        test('uses dynamic average score from scores table when determining winning wine', async () => {
            // arrange
            const tasting = await wineTastingDefinition.create({
                title: 'Test tasting',
                notes: 'Some notes',
                tastingDate: new Date('2023-07-20'),
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 1,
                averageScore: 15, // inskriven poäng är högst...
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 2,
                averageScore: 12,
            });

            // ...men dynamiska poäng gör vin 2 till vinnare
            await scoreDefinition.create({ tastingId: tasting.id, position: 1, memberId: 1, score: 10 });
            await scoreDefinition.create({ tastingId: tasting.id, position: 2, memberId: 2, score: 14 });

            // act
            const result = await tastingRepository.findAll();

            // assert
            expect(result[0].winningWines).toHaveLength(1);
            expect(result[0].winningWines[0].wineId).toBe(2);
            expect(result[0].winningWines[0].averageScore).toBe(14);
        });

    })

    describe('Winning wine', () => {

        test('returns the winning wine in summary when one wine has the highest average score', async () => {
            // arrange
            const tasting = await wineTastingDefinition.create({
                title: 'Test tasting',
                notes: 'Some notes',
                tastingDate: new Date('2023-07-20'),
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 1,
                averageScore: 15,
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 2,
                averageScore: 12,
            });

            // act
            const result = await tastingRepository.findAll();

            // assert
            expect(result[0].winningWines).toHaveLength(1);
            expect(result[0].winningWines[0].wineId).toBe(1);
            expect(result[0].winningWines[0].averageScore).toBe(15);
        });

        test('returns all wines when multiple wines share the highest average score', async () => {
            // arrange
            const tasting = await wineTastingDefinition.create({
                title: 'Test tasting',
                notes: 'Some notes',
                tastingDate: new Date('2023-07-20'),
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 1,
                averageScore: 15,
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 2,
                averageScore: 15,
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 3,
                averageScore: 12,
            });

            // act
            const result = await tastingRepository.findAll();

            // assert
            expect(result[0].winningWines).toHaveLength(2);
            expect(result[0].winningWines.map(w => w.wineId)).toEqual(expect.arrayContaining([1, 2]));
        });

        test('returns the wine name of the winning wine', async () => {
            // arrange
            const tasting = await wineTastingDefinition.create({
                title: 'Test tasting',
                notes: 'Some notes',
                tastingDate: new Date('2023-07-20'),
            });

            await wineTastingWineDefinition.create({
                wineTastingId: tasting.id,
                wineId: (await createWine()).id,
                position: 1,
                averageScore: 15,
            });

            // act
            const result = await tastingRepository.findAll();

            // assert
            expect(result[0].winningWines[0].wineName).toBe('Château Vadeau');
        });

    })
});