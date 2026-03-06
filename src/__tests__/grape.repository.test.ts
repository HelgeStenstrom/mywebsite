import {Sequelize} from "sequelize";
import {GrapeRepository} from "../orm/repositories/grape.repository";
import {defineGrape} from "../orm/models/grape.model";
import {afterEach} from "@jest/globals";

describe('GrapeRepository', () => {
    let sequelize: Sequelize;
    let grapeRepository: GrapeRepository;


    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite", logging: false});

        const grapeDefinition = defineGrape(sequelize);
        await sequelize.sync({force: true});

        grapeRepository = new GrapeRepository(grapeDefinition);

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
        })

        // Verify it can be found
        const found = await grapeRepository.findById(id);
        expect(found).toEqual({
            id: id,
            name: "New name",
            color: "grön",
        })

    });




})