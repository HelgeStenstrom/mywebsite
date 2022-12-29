import {describe, expect, test, afterEach, beforeEach} from "@jest/globals";

import {agent as request} from "supertest";
import express from "express";
import {app} from "../backend";



describe('sdf', () => {
    test('a test', () => {
        expect(2 + 1).toEqual(3);
    });
});

describe('real backend', () => {

    let connection;
    beforeEach(() => {
        connection = app.listen(3003, () => {
            console.log('app is running');
        });
    });

    afterEach(() => {
        console.log('afterEach is run');
        connection.close();
    });

    test('it returns 200 OK ', (done) => {

        request(connection)
            .get('/api/v1/vinprovning/13')
            .expect(200, done);
    });

});