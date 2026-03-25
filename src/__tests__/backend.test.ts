import {describe, expect, test} from "@jest/globals";
import {app, setupEndpoints} from "../backendRouting";
import {Orm} from "../orm";
import {Options} from "sequelize";

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
    const sequelizeDbOptions : Options = {dialect: "sqlite", storage: ":memory:", logging:false};

    test('minimal test', async () => {
        const orm = new Orm('test', 'test', 'test', sequelizeDbOptions);
        setupEndpoints(app, orm)
    });
});
