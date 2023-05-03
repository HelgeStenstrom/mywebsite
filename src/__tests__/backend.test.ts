import {describe, expect, test} from "@jest/globals";
import {app, setupEndpoints} from "../backendRouting";

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


describe('setupEndpoints', () => {

    test('minimal test', async () => {
        setupEndpoints(app, {dialect: "sqlite",})
    });
});
