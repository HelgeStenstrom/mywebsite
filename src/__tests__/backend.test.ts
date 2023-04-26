import {describe, expect, test} from "@jest/globals";
import {app} from "../backend";

describe('block name', () => {

    test('test namn', () => {
        expect(2).toEqual(2);
    });
});


describe('backend tests', () => {

    test('app from the backend is defined', () => {
        expect(app).toBeTruthy();
    });
});
