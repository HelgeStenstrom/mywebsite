import {ModelStatic, Sequelize} from "sequelize";
import {WineTastingHostInstance, WineTastingInstance} from "../types/wine-tasting";
import {defineTasting} from "../orm/models/tasting.model";
import {defineWineTastingHost} from "../orm/models/wine-tasting-host.model";
import {connectTastingAndTastingHost} from "../orm";
import {WineTastingHostRepository} from "../orm/repositories/wine-tasting-host.repository";
import {MemberInstance} from "../types/member";
import {defineMember} from "../orm/models/member.model";

describe('WineTastingHostRepository', () => {

    let sequelize: Sequelize;
    let tastingDefinition: ModelStatic<WineTastingInstance>;
    let wineTastingHostDefinition: ModelStatic<WineTastingHostInstance>;
    let memberDefinition: ModelStatic<MemberInstance>;

    let repository: WineTastingHostRepository;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite", logging: false});

        tastingDefinition = defineTasting(sequelize);
        wineTastingHostDefinition = defineWineTastingHost(sequelize);
        memberDefinition = defineMember(sequelize);

        connectTastingAndTastingHost(tastingDefinition, memberDefinition, wineTastingHostDefinition);

        await sequelize.sync({force: true});

        repository = new WineTastingHostRepository(wineTastingHostDefinition);
    })

    afterEach(async () => {
        await sequelize.close();
    });


    test('create and findByTastingId returns the created host', async () => {

        const tasting = await tastingDefinition.create({
            title: 'Test tasting',
            notes: 'Some notes',
            tastingDate: new Date('2023-07-20'),
        })

        const member = await memberDefinition.create({
            given: 'Nomen',
            surname: 'Nescio',
            isActive: true,
        });
        await repository.create(tasting.id, { memberId: member.id });

        const result = await repository.findByTastingId(tasting.id);
        expect(result).toHaveLength(1);


        expect(result[0]).toEqual({
            memberId: member.id,
        });


    })

    test('This too shall pass', () => {
        expect(true).toBe(true);
    })
});