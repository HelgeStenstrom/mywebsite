import {Sequelize} from 'sequelize';
import {defineTasting} from '../orm/models/tasting.model';
import {TastingRepository} from '../orm/repositories/tasting.repository';
import {defineWineTastingHost} from "../orm/models/wine-tasting-host.model";

describe('TastingRepository', () => {
    let sequelize: Sequelize;
    let WineTasting: any;
    let tastingRepository: TastingRepository;
    let WineTastingHost: any;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite" ,  logging: false });

        WineTasting = defineTasting(sequelize);
        WineTastingHost = defineWineTastingHost(sequelize);
        await sequelize.sync({ force: true });

        tastingRepository = new TastingRepository(WineTasting);

    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('returns WineTastingDto with empty hosts array', async () => {
        // arrange
        await WineTasting.create({
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: new Date('2023-07-20'),
        });

        // act
        const result = await tastingRepository.findTastings();

        // assert
        expect(result).toHaveLength(1);

        expect(result[0]).toEqual({
            id: expect.any(Number),
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: '2023-07-20',
            hosts: [],
        });
    });

    test('returns WineTastingDto with hosts when hosts exist', async () => {
        // arrange
        const tasting = await WineTasting.create({
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: new Date('2023-07-20'),
        });

        await WineTastingHost.create({
            wineTastingId: tasting.id,
            memberId: 42,
        });

        // act
        const result = await tastingRepository.findTastings();

        // assert
        expect(result).toHaveLength(1);

        expect(result[0]).toEqual({
            id: expect.any(Number),
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: '2023-07-20',
            hosts: [],
        });
    });
});