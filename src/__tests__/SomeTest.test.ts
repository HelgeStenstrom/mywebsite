import {describe, expect, test, afterEach, beforeEach} from "@jest/globals";

import {agent as request} from "supertest";
import express from "express";



describe('sdf', () => {
    test('a test', () => {
        expect(2 + 1).toEqual(3);
    });
});

describe('backend', () => {

    let app;
    let listen;

    beforeEach(() => {
        app = express();
        listen = app.listen(3003, () => {
            console.log('app is running');
        });
    });

    afterEach(() => {
        console.log('afterEach is run');
        listen.close();
    });

    test('it returns 200 OK ', (done) => {

        request(app)
            .get('/api/v1/vinprovning/13')
            //.send()
            .expect(200, done);
    });



});