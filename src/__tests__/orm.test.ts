import {beforeEach, describe, expect, test} from "@jest/globals";
import {Model} from "sequelize";
import {Orm} from "../orm";

describe('block name', () => {

    test('test namn', () => {
        expect(2).toEqual(2);
    });
});

describe('Database tests', () => {

    let orm: Orm;

    beforeEach(() => {
        orm = new Orm("myDatabase", "myUserName", "mySecret",
            {
                dialect: "sqlite",
            });
    });

    describe('Grape tests', () => {
        test('post and read back grape', async () => {

            await orm.createTables();

            await orm.postGrape({name: "first", color: "gray"});
            await orm.postGrape({name: "2nd", color: "yellow"});

            const grapesBack = await orm.findGrapes();

            // Verify in various ways
            expect(JSON.stringify(grapesBack)).toEqual(JSON.stringify([
                {"id": 1, "name": "first", "color": "gray"},
                {"id": 2, "name": "2nd", "color": "yellow"}
            ]));

            expect(1).toEqual(grapesBack[0]["id"]);
            expect(2).toEqual(grapesBack[1]["id"]);
            expect("first").toEqual(grapesBack[0]["name"]);
            expect("2nd").toEqual(grapesBack[1]["name"]);
            expect("gray").toEqual(grapesBack[0]["color"]);
            expect("yellow").toEqual(grapesBack[1]["color"]);
        });

        test('delete a grape', async () => {

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
            expect(prePatchGrapes[0]["id"]).toEqual(1);
            expect(prePatchGrapes[0]["name"]).toEqual("g1");

            // Exercise
            await orm.patchGrape({name: "g1", color: "gray"}, {name: "g2", color: "white"})

            // Verify
            const grapes = await orm.findGrapes();
            expect(grapes.length).toEqual(1);
            expect(grapes[0]["id"]).toEqual(1);
            expect(grapes[0]["name"]).toEqual("g2");
        });
    });

    describe('Countries tests', () => {

        test('post and read back countries', async () => {
            await orm.createTables();

            await orm.postCountry({name: "Norge"});
            const countries = await orm.findCountries();

            expect(countries[0]["name"]).toEqual("Norge");
        });
    })

    describe('Tastings tests', () => {

        test('post and read back tasting', async () => {
            await orm.createTables();

            await orm.postTasting({title: "Till fisk", notes: "hemma hos", date: "2021-03-28"});
            await orm.postTasting({title: "Till kött", notes: "hemma hos oss", date: "2022-03-28"});
            const tastings = await orm.findTastings();

            expect(tastings[1]["title"]).toEqual("Till kött");

            const tasting = await orm.getTasting(1);
            expect(tasting["title"]).toEqual("Till fisk");
        });
    });

    describe('Countries tests', () => {

        test('post and read back countries', async () => {
            await orm.createTables();
            await orm.postCountry({name: "Norge"});
            await orm.postCountry({name: "Finland"});

            const countries = await orm.findCountries();

            expect(countries[0]["name"]).toEqual("Norge");
            expect(countries[1]["name"]).toEqual("Finland");
        });
    });

    describe('Members tests', () => {
        test('Post and read back members', async () => {
            await orm.createTables();
            await orm.postMember({Förnamn: "Nomen", Efternamn: "Nescio"})

            const members = await orm.findMembers();

            expect(members[0]["Förnamn"]).toEqual("Nomen");
        });
    });

    describe('Winetype tests', () => {
        test('Post and read back winetypes', async () => {

            await orm.createTables();
            await orm.postWineType({sv: "rött", en: "red"});
            await orm.postWineType({sv: "vitt", en: "white"});

            const wineTypes = await orm.findWineTypes();

            expect(wineTypes[0]["sv"]).toEqual("rött");
            expect(wineTypes[0]["en"]).toEqual("red");
            expect(wineTypes[1]["sv"]).toEqual("vitt");
            expect(wineTypes[1]["en"]).toEqual("white");

            expect(wineTypes[1]["id"]).toEqual(2);

        });
    });


    describe('Wine test', () => {
        test('Post and read back wines', async () => {
            await orm.createTables();

            // First ensure that we have the needed winetype
            const wineType0 = await orm.postWineType({sv: "sadf", en: "df"});
            const wineType = await orm.postWineType({sv: "rött", en: "red"});

            // Then ensure that we have the needed country
            const country = await orm.postCountry({name: "Sverige"});

            // post the wine
            const wine = await orm.postWine({
                country: country['id'],
                name: 'Rödtjut',
                systembolaget: 4711,
                volume: 750,
                winetype: wineType['id']
            })

            const wines = await orm.findWines();
            const first = wines[0];
            expect(first['name']).toBeTruthy();
            expect(first['name']).toEqual('Rödtjut');

            //expect(first.countryModel.name).toEqual("Sverige");
            //expect(first.winetypeModel.sv).toEqual("rött");



        });
    });

    describe('Wine tests with common database setup', () => {


        let wineType: Model<any, any>;
        let country: Model<any, any>;

        beforeEach(async () => {
            await orm.createTables();

            // First ensure that we have the needed winetype
            const wineType0 = await orm.postWineType({sv: "sadf", en: "df"});
            wineType = await orm.postWineType({sv: "rött", en: "red"});

            // Then ensure that we have the needed country
             country = await orm.postCountry({name: "Sverige"});
        });

        test('check the setup', async () => {
            const wineTypes = await orm.findWineTypes();
            expect(wineTypes[1]["sv"]).toEqual("rött");
            const countries = await orm.findCountries();
            expect(countries[0]["name"]).toEqual("Sverige");
        });

        test('post a wine and check it manually', async () => {
            const wine = await orm.postWine({
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
            const wine = await orm.postWine({
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


});
