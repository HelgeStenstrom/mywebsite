import { beforeEach, describe, expect, test } from "@jest/globals";
import { CountryInstance, Orm, WineTypeInstance } from "../orm";

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
            await orm.postCountry({name: "Norge"});
            await orm.postCountry({name: "Finland"});

            const countries = await orm.findCountries();

            expect(countries[0].name).toEqual("Norge");
            expect(countries[1].name).toEqual("Finland");
        });

        test('try to delete non-existing country', async () => {
            await orm.createTables();
            await orm.postCountry({name: "Norge"});
            const nonExistingId = 17;
            const numberOfDeletedItems = await orm.delCountryById(nonExistingId);
            expect(numberOfDeletedItems).toEqual(0);
            const countryInstances = await orm.findCountries();
            expect(countryInstances.length).toEqual(1);
        });

        test('post and delete country', async() => {
            await orm.createTables();
            await orm.postCountry({name: "Norge"});
            const countryInstances = await orm.findCountries();
            const idToDelete = countryInstances[0].id;
            const numberOfDeletedItems = await orm.delCountryById(idToDelete);
            expect(numberOfDeletedItems).toEqual(1);
            const instancesAfterDeletion = await orm.findCountries();
            expect(instancesAfterDeletion.length).toEqual(0);
        });

        test.skip('try to delete country in use', async () => {

            await orm.createTables();

            const countryInstance = await orm.postCountry("A country");
            const wineTypeInstance = await orm.postWineType({sv:"rött", en: "red"});
            const wineInstance = await orm.postWine({
                country: countryInstance.id,
                name: "Wine name",
                volume: 750,
                winetype: wineTypeInstance.id,
                systembolaget: null
            });

            // Deleting the country is expected to fail, because it's used in a wine.

            const numberOfDeletions = await orm.delCountryById(countryInstance.id);

            expect(numberOfDeletions).toEqual(0);

            fail("test not done");
        });
    })


    describe('Grape tests', () => {

        test('post two grapes and check ID', async () => {
            // We mostly want to check that the values returned are the values sent,
            // and that the ID gets incremented.
            await orm.createTables();

            const first = (await orm.postGrape({name: "first", color: "gray"})).dataValues;
            const second = (await orm.postGrape({name: "second", color: "blue"})).dataValues;
            expect(first.name).toEqual("first");
            expect(first.color).toEqual("gray");
            expect(first.id).toEqual(1); // TODO: this is not an actual requirement; test something else.
            expect(second.name).toEqual("second");
            expect(second.color).toEqual("blue");
            expect(second.id).toEqual(2);
        });

        test('post and read back grape', async () => {

            await orm.createTables();

            await orm.postGrape({name: "first", color: "gray"});
            const secondPosted = await orm.postGrape({name: "second", color: "blue"});

            const grapesBack = await orm.findGrapes();

            expect(grapesBack.length).toEqual(2);
            const firstBack = grapesBack.filter(g => g.name === "first")[0];
            const secondBack = grapesBack.filter(g => g.id === secondPosted.id)[0];
            expect(firstBack.color).toEqual("gray");
            expect(secondBack.color).toEqual("blue");
        });

        test('delete a grape by name', async () => {

            // Setup
            await orm.createTables();
            await orm.postGrape({name: "g1", color: "gray"});
            await orm.postGrape({name: "g2", color: "gray"});
            await orm.postGrape({name: "g3", color: "gray"});

            // Exercise
            await orm.delGrape("g2");

            // Verify
            const grapes = await orm.findGrapes();
            expect(grapes.length).toEqual(2);
        });

        test('patch a grape', async () => {

            // Setup
            await orm.createTables();
            await orm.postGrape({name: "g1", color: "gray"});
            const prePatchGrapes = await orm.findGrapes();
            expect(prePatchGrapes[0].id).toEqual(1);
            expect(prePatchGrapes[0].name).toEqual("g1");

            // Exercise
            await orm.patchGrapeByNameAndColor(
                {id: 1, name: 'g1', color: 'gray'},
                {id: 1, name: "g2", color: "white"})

            // Verify
            const grapes = await orm.findGrapes();
            expect(grapes.length).toEqual(1);
            expect(grapes[0].id).toEqual(1);
            expect(grapes[0].name).toEqual("g2");
        });
    });

    describe('Members tests', () => {
        test('Post and read back members', async () => {
            await orm.createTables();
            await orm.postMember({given: "Nomen", surname: "Nescio"})

            const members = await orm.findMembers();
            expect(members[0].given).toEqual("Nomen");
        });
    });

    describe('Tastings tests', () => {

        test('post and read back tasting', async () => {
            await orm.createTables();

            await orm.postTasting({title: "Till fisk", notes: "hemma hos", date: "2021-03-28"});
            await orm.postTasting({title: "Till kött", notes: "hemma hos oss", date: "2022-01-01"});
            const tastings = await orm.findTastings();

            expect(tastings[1].title).toEqual("Till kött");

            const tasting = await orm.getTasting(1);
            expect(tasting.title).toEqual("Till fisk");
            expect(tasting.date).toEqual(new Date("2021-03-28"));

        });
    });

    describe('Wine test', () => {
        test('Post and read back wines', async () => {
            await orm.createTables();

            // First ensure that we have the needed winetype
            const wineType = await orm.postWineType({sv: "rött", en: "red"});

            // Then ensure that we have the needed country
            const country = await orm.postCountry({name: "Sverige"});

            // post the wine
            await orm.postWine({
                country: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                winetype: wineType['id']
            })

            const wines = await orm.findWines();
            const first = wines[0];

            // Verify
            expect(first['name']).toBeTruthy();
            expect(first['name']).toEqual('Rödtjut');
        });

        test('Delete a wine by ID', async () => {

            // Setup
            await orm.createTables();

            // First ensure that we have the needed winetype
            const wineType = await orm.postWineType({sv: "rött", en: "red"});

            // Then ensure that we have the needed country
            const country = await orm.postCountry({name: "Sverige"});

            // post the wine
            const wineToBeDeleted = await orm.postWine({
                country: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                winetype: wineType['id']
            })

                  // post another wine
            const otherWine = await orm.postWine({
                country: country['id'],
                name: 'Other',
                systembolaget: 4711,
                volume: 750,
                winetype: wineType['id']
            });



            const winesBefore = await orm.findWines();

            expect(winesBefore.length).toEqual(2);
            const first = winesBefore[0];
            expect(first['name']).toEqual('Rödtjut');

            // Exercise
            await orm.delWineById(wineToBeDeleted.id);

            // Verify
            const winesAfter = await orm.findWines();
            expect(winesAfter.length).toEqual(1);
            // Expect one wine to be deleted, and the other wine to remain.
            expect(winesAfter.filter(w => w.id === otherWine.id).length).toEqual(1);
            expect(winesAfter.filter(w => w.id === wineToBeDeleted.id).length).toEqual(0);

        });

        test.skip('Patch a wine', async () => {

            // Setup
            await orm.createTables();

            // First ensure that we have the needed winetype
            const wineType = await orm.postWineType({sv: "rött", en: "red"});

            // Then ensure that we have the needed country
            const country = await orm.postCountry({name: "Sverige"});

            // post the wine
            await orm.postWine({
                country: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                winetype: wineType['id']
            })

            // Read back, so that we get a wine to patch
            await orm.findWines();

            // TODO: How should we identify wines? The name may not be unique. We need a unique key!

            fail("Test not done yet.");
        });
    });

    describe('Wine tests with common database setup', () => {


        let wineType: WineTypeInstance;
        let country: CountryInstance;

        beforeEach(async () => {
            await orm.createTables();

            // First ensure that we have the needed winetype
            await orm.postWineType({sv: "sadf", en: "df"});
            wineType = await orm.postWineType({sv: "rött", en: "red"});

            // Then ensure that we have the needed country
             country = await orm.postCountry({name: "Sverige"});
        });

        test('check the setup', async () => {
            const wineTypes = await orm.findWineTypes();
            expect(wineTypes[1].sv).toEqual("rött");
            const countries = await orm.findCountries();
            expect(countries[0].name).toEqual("Sverige");
        });

        test('post a wine and check it manually', async () => {
            await orm.postWine({
                country: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                winetype: wineType['id']
            })


            const winesNoOptions = await orm.findWinesNoOptions();
            expect(winesNoOptions).toBeTruthy();
            expect(winesNoOptions).not.toHaveLength(0);

            console.log("==== EXERCISE findWines()  ========")

            const allWines = await orm.findWines();
            expect(allWines).toBeTruthy();
            expect(allWines).not.toHaveLength(0);

            expect(allWines).toBeTruthy();
            const postedWine = allWines[0];
            expect(postedWine).toBeTruthy();
            //console.log('All wines:', postedWine);
            expect(postedWine['name']).toEqual("Rödtjut");
            expect(postedWine['systembolaget']).toEqual(4711);
            expect(postedWine['category']).toEqual("rött");
            expect(postedWine['country']).toEqual("Sverige");
            expect(postedWine['volume']).toEqual(750);

        })

        test('findWinesNoOptions', async () => {
            await orm.postWine({
                country: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                winetype: wineType['id']
            })


            console.log("==== EXERCISE findWinesNoOptions()  ========")
            const winesNoOptions = await orm.findWinesNoOptions();
            expect(winesNoOptions).toBeTruthy();

            expect(winesNoOptions).not.toHaveLength(0);


        });
    });

    describe('Winetype tests', () => {
        test('Post and read back winetypes', async () => {

            await orm.createTables();
            await orm.postWineType({sv: "rött", en: "red"});
            await orm.postWineType({sv: "vitt", en: "white"});

            const wineTypes = await orm.findWineTypes();

            expect(wineTypes[0].sv).toEqual("rött");
            expect(wineTypes[0].en).toEqual("red");
            expect(wineTypes[1].sv).toEqual("vitt");
            expect(wineTypes[1].en).toEqual("white");

            expect(wineTypes[1].id).toEqual(2);

        });
    });


});
