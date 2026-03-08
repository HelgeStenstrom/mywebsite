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

    test('create wine with vintage year saves vintageYear correctly', async () => {
        const country = await countryDefinition.create({name: "test"})
        const wineType = await wineTypeDefinition.create({name: "test"});

        const created = await wineRepository.create({
            countryId: country.id,
            name: "Test",
            volume: 0, // TODO: make optional
            wineTypeId: wineType.id,
            isNonVintage: false,
            vintageYear: 2023,
        })

        expect(created.vintageYear).toEqual(2023);
        expect(created.isNonVintage).toEqual(false);
    });

    test('create non-vintage wine saves isNonVintage correctly', async () => {
        const country = await countryDefinition.create({name: "test"})
        const wineType = await wineTypeDefinition.create({name: "test"});

        const created = await wineRepository.create({
            countryId: country.id,
            name: "Test",
            volume: 0, // TODO: make optional
            wineTypeId: wineType.id,
            isNonVintage: true,
            vintageYear: 2023,
        })

        expect(created.vintageYear).toBeNull(); // Because isNonVintage is true, we should not save vintageYear
        expect(created.isNonVintage).toEqual(true);

    });

    test('create wine with unknown vintage saves both as null/false', async () => {
        const country = await countryDefinition.create({name: "Sverige"})
        const wineType = await wineTypeDefinition.create({name: "rött"});

        const created = await wineRepository.create({
            countryId: country.id,
            isNonVintage: false,
            name: "",
            volume: 0,
            wineTypeId: wineType.id,
        });

        expect(created.vintageYear).toBeNull();
        expect(created.isNonVintage).toEqual(false);
    });

    }
)