import {ModelStatic, Sequelize} from "sequelize";
import {WineCreateDto, WineDto, WineInstance} from "../types/wine";
import {WineRepository} from "../orm/repositories/wine.repository";
import {CountryInstance} from "../types/country";
import {WineTypeInstance} from "../types/wine-type";
import {defineWine} from "../orm/models/wine.model";
import {defineCountry} from "../orm/models/country.model";
import {defineWineType} from "../orm/models/wine-type.model";
import {connectWineAndCountry, connectWineAndWineType} from "../orm";

describe('WineRepository', () => {
    let sequelize: Sequelize;
    let wineRepository: WineRepository;
    let wineDefinition: ModelStatic<WineInstance>;
    let countryDefinition: ModelStatic<CountryInstance>;
    let wineTypeDefinition: ModelStatic<WineTypeInstance>;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite" ,  logging: false });

        wineDefinition = defineWine(sequelize);
        countryDefinition = defineCountry(sequelize);
        wineTypeDefinition = defineWineType(sequelize);

        connectWineAndWineType(wineDefinition, wineTypeDefinition);
        connectWineAndCountry(wineDefinition, countryDefinition);

        await sequelize.sync({force: true})

        wineRepository = new WineRepository(wineDefinition, countryDefinition, wineTypeDefinition);
    })

    afterEach(async () => {
        await sequelize.close();
    })

    test('create returns the created wine', async () => {
        const country = await countryDefinition.create({name: "Sverige"});
        const wineType = await wineTypeDefinition.create({id: 1, name: "rött"});

        const toCreate: WineCreateDto = {
            name: 'Testvin',
            countryId: country.id,
            volume: 0,
            wineTypeId: wineType.id,
            isNonVintage: false,
        };

        const created = await wineRepository.create(toCreate);
        const expected: WineDto = {
            createdAt: null,
            isNonVintage: false,
            systembolaget: null,
            vintageYear: null,
            wineType: {
                id: 1,
                name: "rött",
            },
            id: 1,
            name: 'Testvin',
            country: {
                id: 1,
                name: "Sverige",
            },
            volume: 0
        };
        expect(created).toEqual(expected)
    });

    }
)