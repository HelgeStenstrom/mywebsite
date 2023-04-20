import {describe, expect, test} from "@jest/globals";
import {Orm} from "./orm";

describe('block name', () => {

    test('test namn', () => {
        expect(2).toEqual(2);
    });
});

describe('Database tests', () => {

    const orm = new Orm("myDatabase", "myUserName", "mySecret",
        {
            dialect: "sqlite",
        });

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
});
