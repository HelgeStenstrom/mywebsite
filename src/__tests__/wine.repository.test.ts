import {ModelStatic, Sequelize} from "sequelize";
import {WineCreateDto, WineDto, WineGrapeInstance, WineInstance} from "../types/wine";
import {WineRepository} from "../orm/repositories/wine.repository";
import {CountryInstance} from "../types/country";
import {WineTypeInstance} from "../types/wine-type";
import {defineWine} from "../orm/models/wine.model";
import {defineCountry} from "../orm/models/country.model";
import {defineWineType} from "../orm/models/wine-type.model";
import {
    connectWineAndCountry,
    connectWineAndWineGrape,
    connectWineAndWineTastingWine,
    connectWineAndWineType
} from "../orm";
import {defineTasting} from "../orm/models/tasting.model";
import {defineWineTastingWine} from "../orm/models/wine-tasting-wine.model";
import {WineTastingInstance, WineTastingWineInstance} from "../types/wine-tasting";
import {defineWineGrape} from "../orm/models/wine-grape.model";

describe('WineRepository', () => {
    let sequelize: Sequelize;
    let wineRepository: WineRepository;
    let wineDefinition: ModelStatic<WineInstance>;
    let countryDefinition: ModelStatic<CountryInstance>;
    let wineTypeDefinition: ModelStatic<WineTypeInstance>;
    let wineTastingWineDefinition: ModelStatic<WineTastingWineInstance>;
    let tastingDefinition: ModelStatic<WineTastingInstance>;
    let wineGrapeDefinition: ModelStatic<WineGrapeInstance>;

        beforeEach(async () => {
            sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite", logging: false});

            wineDefinition = defineWine(sequelize);
            countryDefinition = defineCountry(sequelize);
            wineTypeDefinition = defineWineType(sequelize);
            wineTastingWineDefinition = defineWineTastingWine(sequelize);
            tastingDefinition = defineTasting(sequelize);wineGrapeDefinition = defineWineGrape(sequelize);

            connectWineAndWineType(wineDefinition, wineTypeDefinition);
            connectWineAndCountry(wineDefinition, countryDefinition);
            connectWineAndWineTastingWine(wineDefinition, wineTastingWineDefinition);
            connectWineAndWineGrape(wineDefinition, wineGrapeDefinition);

            await sequelize.sync({force: true})

            wineRepository = new WineRepository(
                wineDefinition,
                countryDefinition,
                wineTypeDefinition,
                wineTastingWineDefinition,
                wineGrapeDefinition,);
        });

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
            grapes: [],
            id: 1,
            name: 'Testvin',
            country: {
                id: 1,
                name: "Sverige",
            },
            volume: 0,
            isUsed: false,
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

    test('delete returns in_use when wine is used in a tasting', async () => {

        const country = await countryDefinition.create({name: 'Frankrike'});
        const wineType = await wineTypeDefinition.create({name: 'Rött'});
        const wine = await wineDefinition.create({
            name: 'Testvin',
            countryId: country.id,
            wineTypeId: wineType.id,
            isNonVintage: false,
        });

        const tasting = await tastingDefinition.create({
            title: 'Test provning',
            notes: 'Noter',
            tastingDate: new Date('2024-01-15'),
        });

        await wineTastingWineDefinition.create({
            wineTastingId: tasting.id,
            wineId: wine.id,
            position: 1,
        });

        const result = await wineRepository.delete(wine.id);
        expect(result).toBe('in_use');
    });

    test('find wine by id', async () =>{
        const country = await countryDefinition.create({name: "Sverige"});
        const wineType = await wineTypeDefinition.create({id: 1, name: "rött"});

        const toCreate: WineCreateDto = {
            name: 'Testvin',
            countryId: country.id,
            wineTypeId: wineType.id,
            isNonVintage: false,
        };

        const created = await wineRepository.create(toCreate);

        const id = created.id;

        const found: WineDto = await wineRepository.findById(id);

        expect(found).toEqual({
            id:1,
            name: 'Testvin',
            country: {id:1,name: "Sverige"},
            wineType: {id:1, name: "rött"},
            grapes: [],
            createdAt: null,
            isUsed: false,
            isNonVintage: false,
            systembolaget: null,
            vintageYear: null,
            volume: null,
        });


    })

    test('find wine by id includes grapes', async () => {
        const country = await countryDefinition.create({name: "Sverige"});
        const wineType = await wineTypeDefinition.create({name: "rött"});

        const created = await wineRepository.create({
            name: 'Testvin',
            countryId: country.id,
            wineTypeId: wineType.id,
            isNonVintage: false,
        });

        await wineGrapeDefinition.create({
            wineId: created.id,
            grapeId: 1,
            percentage: 75.5,
        });

        const found = await wineRepository.findById(created.id);

        expect(found.grapes).toEqual([{
            id: expect.any(Number),
            wineId: created.id,
            grapeId: 1,
            percentage: 75.5,
        }]);
    });

    }
)