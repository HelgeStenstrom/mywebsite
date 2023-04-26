import {beforeEach, describe, expect, test} from "@jest/globals";
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
        test('post and read back grape', async() => {

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

        test('post and read back counries', async() => {
            await orm.createTables();

            await orm.postCountry({name: "Norge"});
            const countries = await orm.findCountries();

            expect(countries[0]["name"]).toEqual("Norge");
        });
    })

    describe('Tastings tests', () => {

        test('post and read back tasting', async() => {
            await orm.createTables();

            await orm.postTasting({title: "Till fisk", notes: "hemma hos", date:"2021-03-28"});
            await orm.postTasting({title: "Till kött", notes: "hemma hos oss", date:"2022-03-28"});
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


});
