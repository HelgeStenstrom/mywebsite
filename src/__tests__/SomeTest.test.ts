import {describe, expect, test, afterEach, beforeEach} from "@jest/globals";
import {agent as request} from "supertest";
import {app} from "../backend";

describe('real backend', () => {

    let connection;
    beforeEach(() => {
        connection = app.listen(3003, () => {
        });
    });

    afterEach(() => {
        connection.close();
    });

    test('it returns 200 OK, checked by Supertest', (done) => {
        request(connection)
            .get('/api/v1/vinprovning/13')
            .expect(200, done);
    });

    test('it returns 200 OK, checked by Jest', (done) => {
        request(connection)
            .get('/api/v1/vinprovning/13')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });

});