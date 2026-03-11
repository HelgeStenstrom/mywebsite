import {ModelStatic, Sequelize} from 'sequelize';
import {defineTasting} from '../orm/models/tasting.model';
import {TastingRepository} from '../orm/repositories/tasting.repository';
import {defineWineTastingHost} from "../orm/models/wine-tasting-host.model";
import {defineMember} from "../orm/models/member.model";
import {connectTastingAndTastingHost} from "../orm";
import {WineTastingHostInstance, WineTastingInstance, WineTastingWineInstance} from "../types/wine-tasting";
import {MemberInstance} from "../types/member";
import {defineWineTastingWine} from "../orm/models/wine-tasting-wine.model";

describe('TastingRepository', () => {
    let sequelize: Sequelize;
    let tastingRepository: TastingRepository;
    let wineTastingDefinition:  ModelStatic<WineTastingInstance>;
    let wineTastingHostDefinition:  ModelStatic<WineTastingHostInstance>;
    let wineTastingWineDefinition:  ModelStatic<WineTastingWineInstance>;
    let memberDefinition:  ModelStatic<MemberInstance>;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite" ,  logging: false });

        wineTastingDefinition = defineTasting(sequelize);
        wineTastingHostDefinition = defineWineTastingHost(sequelize);
        memberDefinition = defineMember(sequelize);
        wineTastingWineDefinition = defineWineTastingWine(sequelize);

        connectTastingAndTastingHost(wineTastingDefinition, memberDefinition, wineTastingHostDefinition,);


        await sequelize.sync({ force: true });

        tastingRepository = new TastingRepository(
            wineTastingDefinition,
            wineTastingHostDefinition,
            memberDefinition,
            wineTastingWineDefinition);

    });

    afterEach(async () => {
        await sequelize.close();
    });

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
            hosts: [{ memberId: member.id }],
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
});