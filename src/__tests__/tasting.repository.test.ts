import {Sequelize} from 'sequelize';
import {defineTasting} from '../orm/models/tasting.model';
import {TastingRepository} from '../orm/repositories/tasting.repository';

describe('TastingRepository', () => {
    let sequelize: Sequelize;
    let WineTasting: any;
    let tastingRepository: TastingRepository;

    beforeAll(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite" ,  logging: false });

        WineTasting = defineTasting(sequelize);

        await sequelize.sync({ force: true });

        tastingRepository = new TastingRepository(WineTasting);
    });

    afterAll(async () => {
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
});