import {describe, expect, test} from "@jest/globals";
import {app} from "../backend";

describe('block name', () => {

    test('test namn', () => {
        expect(2).toEqual(2);
    });
});


describe('backend tests', () => {

    test('foo', () => {
        expect(app).toBeTruthy();
    });
});
