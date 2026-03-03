import {beforeEach, describe, expect, test} from "@jest/globals";
import {Orm} from "../orm";
import {QueryTypes} from "sequelize";

function fail(message) {
    throw new Error(message);
}


describe('Database tests', () => {

    // TODO: Refactor; remove code duplication in tests.
    //  There is duplication between creation, deletion and patching tests.

    let orm: Orm;

    beforeEach(() => {
        orm = new Orm("myDatabase", "myUserName", "mySecret",
            {
                dialect: "sqlite",
            });
    });

    describe('Countries tests', () => {

        test('post and read back countries', async () => {
            await orm.createTables();
            await orm.countries.postCountry({name: "Norge"});
            await orm.countries.postCountry({name: "Finland"});

            const countries = await orm.countries.findCountries();

            expect(countries).toHaveLength(2);
            expect(countries).toEqual([
                // Countries are returned in alphabetical order.
                {id: 2, name: "Finland", isUsed: false},
                {id: 1, name: "Norge", isUsed: false}
            ]);
        });

        test('try to delete non-existing country', async () => {
            await orm.createTables();
            await orm.countries.postCountry({name: "Norge"});
            const nonExistingId = 17;
            const deleteResponse = await orm.countries.delCountryById(nonExistingId);
            expect(deleteResponse).toEqual('not_found');
            const countryInstances = await orm.countries.findCountries();
            expect(countryInstances.length).toEqual(1);
        });

        test('post and delete country', async() => {
            await orm.createTables();
            await orm.countries.postCountry({name: "Norge"});
            const countryInstances = await orm.countries.findCountries();
            const idToDelete = countryInstances[0].id;
            const deleteResponse = await orm.countries.delCountryById(idToDelete);
            expect(deleteResponse).toEqual('deleted');
            const instancesAfterDeletion = await orm.countries.findCountries();
            expect(instancesAfterDeletion.length).toEqual(0);
        });

        test.skip('try to delete country in use', async () => {

            await orm.createTables();

            const countryInstance = await orm.countries.postCountry("A country");
            const wineTypeInstance = await orm.wineTypes.postWineType({name:"rött"});
            const wineInstance = await orm.wines.postWine({
                countryId: countryInstance.id,
                name: "Wine name",
                volume: 750,
                wineTypeId: wineTypeInstance.id,
                systembolaget: null
            });

            // Deleting the country is expected to fail, because it's used in a wine.

            const numberOfDeletions = await orm.countries.delCountryById(countryInstance.id);

            expect(numberOfDeletions).toEqual(0);

            fail("test not done");
        });
    })


    describe('Grape tests', () => {

        test('post two grapes and check ID', async () => {
            // We mostly want to check that the values returned are the values sent,
            // and that the ID gets incremented.
            await orm.createTables();

            const first = await orm.grapes.postGrape({name: "first", color: "grön"});
            const second = await orm.grapes.postGrape({name: "second", color: "blå"});
            expect(first.name).toEqual("first");
            expect(first.color).toEqual("grön");
            expect(first.id).toEqual(1); // TODO: this is not an actual requirement; test something else.
            expect(second.name).toEqual("second");
            expect(second.color).toEqual("blå");
            expect(second.id).toEqual(2);
        });

        test('post and read back grape', async () => {

            await orm.createTables();

            await orm.grapes.postGrape({name: "first", color: "grön"});
            const secondPosted = await orm.grapes.postGrape({name: "second", color: "blå"});

            const grapesBack = await orm.grapes.findGrapes();

            expect(grapesBack.length).toEqual(2);
            const firstBack = grapesBack.filter(g => g.name === "first")[0];
            const secondBack = grapesBack.filter(g => g.id === secondPosted.id)[0];
            expect(firstBack.color).toEqual("grön");
            expect(secondBack.color).toEqual("blå");
        });

        test('delete a grape by name', async () => {

            // Setup
            await orm.createTables();
            await orm.grapes.postGrape({name: "g1", color: "grön"});
            await orm.grapes.postGrape({name: "g2", color: "grön"});
            await orm.grapes.postGrape({name: "g3", color: "grön"});

            // Exercise
            await orm.grapes.delGrape("g2");

            // Verify
            const grapes = await orm.grapes.findGrapes();
            expect(grapes.length).toEqual(2);
        });

        test('patch a grape', async () => {

            // Setup
            await orm.createTables();
            await orm.grapes.postGrape({name: "g1", color: "grön"});
            const prePatchGrapes = await orm.grapes.findGrapes();
            expect(prePatchGrapes[0].id).toEqual(1);
            expect(prePatchGrapes[0].name).toEqual("g1");

            // Exercise
            await orm.grapes.patchGrapeByNameAndColor(
                {id: 1, name: 'g1', color: 'grön'},
                {id: 1, name: "g2", color: "blå"})

            // Verify
            const grapes = await orm.grapes.findGrapes();
            expect(grapes.length).toEqual(1);
            expect(grapes[0].id).toEqual(1);
            expect(grapes[0].name).toEqual("g2");
        });
    });

    describe('Members tests', () => {
        test('Post and read back members', async () => {
            await orm.createTables();
            await orm.members.postMember({given: "Nomen", surname: "Nescio"})

            const members = await orm.members.findMembers();
            expect(members[0].given).toEqual("Nomen");
        });
    });

    describe('Tastings tests', () => {

        test('post and read back tasting', async () => {
            await orm.createTables();

            await orm.tastings.postTasting({title: "Till fisk", notes: "hemma hos", tastingDate: new Date("2021-03-28")});
            await orm.tastings.postTasting({title: "Till kött", notes: "hemma hos oss", tastingDate: new Date("2022-01-01")});
            const tastings = await orm.tastings.findTastings();

            expect(tastings[1].title).toEqual("Till kött");

            const tasting = await orm.tastings.getTasting(1);
            expect(tasting.title).toEqual("Till fisk");
            expect(tasting.tastingDate).toEqual("2021-03-28");

        });
    });

    describe('Wine test', () => {
        test('Post and read back wines', async () => {
            await orm.createTables();

            // First ensure that we have the needed winetype
            const wineType = await orm.wineTypes.postWineType({name: "rött"});

            // Then ensure that we have the needed country
            const country = await orm.countries.postCountry({name: "Sverige"});

            // post the wine
            await orm.wines.postWine({
                countryId: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                wineTypeId: wineType['id']
            })

            const wines = await orm.wines.findWines();
            const first = wines[0];

            // Verify
            expect(first['name']).toBeTruthy();
            expect(first['name']).toEqual('Rödtjut');
        });

        test('Delete a wine by ID', async () => {

            // Setup
            await orm.createTables();

            // First ensure that we have the needed winetype
            const wineType = await orm.wineTypes.postWineType({name: "rött"});

            // Then ensure that we have the needed country
            const country = await orm.countries.postCountry({name: "Sverige"});

            // post the wine
            const wineToBeDeleted = await orm.wines.postWine({
                countryId: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                wineTypeId: wineType['id']
            })

                  // post another wine
            const otherWine = await orm.wines.postWine({
                countryId: country['id'],
                name: 'Other',
                systembolaget: 4711,
                volume: 750,
                wineTypeId: wineType['id']
            });



            const winesBefore = await orm.wines.findWines();

            expect(winesBefore.length).toEqual(2);
            const first = winesBefore[0];
            expect(first['name']).toEqual('Rödtjut');

            // Exercise
            await orm.wines.delWineById(wineToBeDeleted.id);

            // Verify
            const winesAfter = await orm.wines.findWines();
            expect(winesAfter.length).toEqual(1);
            // Expect one wine to be deleted, and the other wine to remain.
            expect(winesAfter.filter(w => w.id === otherWine.id).length).toEqual(1);
            expect(winesAfter.filter(w => w.id === wineToBeDeleted.id).length).toEqual(0);

        });

        test.skip('Patch a wine', async () => {

            // Setup
            await orm.createTables();

            // First ensure that we have the needed winetype
            const wineType = await orm.wineTypes.postWineType({name: "rött"});

            // Then ensure that we have the needed country
            const country = await orm.countries.postCountry({name: "Sverige"});

            // post the wine
            await orm.wines.postWine({
                countryId: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                wineTypeId: wineType['id']
            })

            // Read back, so that we get a wine to patch
            await orm.wines.findWines();

            // TODO: How should we identify wines? The name may not be unique. We need a unique key!

            fail("Test not done yet.");
        });

        test('Post and read back wines with vintage', async () => {
            await orm.createTables();
            const wineRepo = orm.wines;
            const sequelize = orm.sequelize;

            const [countryId] = await sequelize.query(
                `INSERT INTO countries (name) VALUES ('Testland')`,
                { type: QueryTypes.INSERT }
            ) as [number, unknown];

            const [wineTypeId] = await sequelize.query(
                `INSERT INTO winetypes (name) VALUES ('Rött')`,
                { type: QueryTypes.INSERT }
            ) as [number, unknown];

            await sequelize.query(`
                INSERT INTO wines (name, vintage_year, is_non_vintage, country_id, wine_type_id)
                VALUES ('Testvin', 2019, false, ${countryId}, ${wineTypeId})
            `);

            const [rows] = await sequelize.query(`SELECT * FROM wines`);
            console.log(rows);

            const wines = await wineRepo.findWines();
            expect(wines.length).toBe(1);
            const wineDto = wines[0];
            expect(wineDto.vintageYear).toBe(2019);
            expect(wineDto.isNonVintage).toBe(false);

        })
    });

    describe('Wine tests with common database setup', () => {


        beforeEach(async () => {
            await orm.createTables();

            // First ensure that we have the needed winetype
            await orm.wineTypes.postWineType({name: "zzz"});
            await orm.wineTypes.postWineType({name: "rött"}); // Then ensure that we have the needed country
            await orm.countries.postCountry({name: "Sverige"});
        });

        test('check the setup', async () => {
            const wineTypes = await orm.wineTypes.findWineTypes();
            // Wine types are returned in alphabetical order.
            expect(wineTypes).toEqual([
                {id: 2, name: "rött", isUsed: false},
                {id: 1, name: "zzz", isUsed: false},
            ]);

            const countries = await orm.countries.findCountries();
            expect(countries[0].name).toEqual("Sverige");

        });


    });

    describe('Winetype tests', () => {
        test('Post and read back winetypes', async () => {

            await orm.createTables();
            await orm.wineTypes.postWineType({name: "rött"});
            await orm.wineTypes.postWineType({name: "vitt"});

            const wineTypes = await orm.wineTypes.findWineTypes();

            expect(wineTypes[0].name).toEqual("rött");
            expect(wineTypes[1].name).toEqual("vitt");

            expect(wineTypes[1].id).toEqual(2);

        });
    });


});
