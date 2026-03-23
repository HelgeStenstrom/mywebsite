import {ModelStatic, Sequelize} from "sequelize";
import {GrapeRepository} from "../orm/repositories/grape.repository";
import {defineGrape} from "../orm/models/grape.model";
import {afterEach} from "@jest/globals";
import {WineGrapeInstance} from "../types/wine";
import {defineWineGrape} from "../orm/models/wine-grape.model";

describe('GrapeRepository', () => {
    let sequelize: Sequelize;
    let grapeRepository: GrapeRepository;
    let WineGrape: ModelStatic<WineGrapeInstance>;


    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite", logging: false});

        const grapeDefinition = defineGrape(sequelize);
        WineGrape = defineWineGrape(sequelize);
        await sequelize.sync({force: true});

        grapeRepository = new GrapeRepository(grapeDefinition, WineGrape);

    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('create returns the created grape', async () => {

        const created = await grapeRepository.create({
            name: "Rondo",
            color: "blå",
        });

        expect(created).toEqual({
            id: 1,
            name: "Rondo",
            color: "blå",
            isUsed: false,
        })
    });

    test('findAll returns the posted grape', async () => {

        // First create a grape
        await grapeRepository.create({
            name: "Rondo",
            color: "blå",
        });

        // Then find it
        const grapes = await grapeRepository.findAll();

        // Verify
        expect(grapes.length).toEqual(1);
        expect(grapes[0]).toEqual({
            id: 1,
            name: "Rondo",
            color: "blå",
            isUsed: false,
        });
    });

    test('update returns the changed grape', async () => {

        // First create two grapes
        await grapeRepository.create({
            name: "Ignore",
            color: "blå",
        });

        const created = await grapeRepository.create({
            name: "ToBeChanged",
            color: "blå",
        });

        // Then update it
        const id = created.id;
        const changed = await grapeRepository.update(id,
            { name: "New name",
                color: "grön",
            });

        // Verify the changed grape is returned
        expect(changed).toEqual({
            id: id,
            name: "New name",
            color: "grön",
            isUsed: false,
        })

        // Verify it can be found
        const found = await grapeRepository.findById(id);
        expect(found).toEqual({
            id: id,
            name: "New name",
            color: "grön",
            isUsed: false,
        })

    });


    test('findAll returns isUsed: false when grape is not used in any wine', async () => {
        await grapeRepository.create({ name: "Rondo", color: "blå" });

        const grapes = await grapeRepository.findAll();

        expect(grapes[0].isUsed).toBe(false);
    });

    test('findAll returns isUsed: true when grape is used in a wine', async () => {
        const grape = await grapeRepository.create({ name: "Rondo", color: "blå" });
        await WineGrape.create({ wineId: 99, grapeId: grape.id });

        const grapes = await grapeRepository.findAll();

        expect(grapes[0].isUsed).toBe(true);
    });

    test('findById returns isUsed: false when grape is not used in any wine', async () => {
        const grape = await grapeRepository.create({ name: "Rondo", color: "blå" });

        const found = await grapeRepository.findById(grape.id);

        expect(found.isUsed).toBe(false);
    });

    test('findById returns isUsed: true when grape is used in a wine', async () => {
        const grape = await grapeRepository.create({ name: "Rondo", color: "blå" });
        await WineGrape.create({ wineId: 99, grapeId: grape.id });

        const found = await grapeRepository.findById(grape.id);

        expect(found.isUsed).toBe(true);
    });


})