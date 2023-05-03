import {describe, expect, test, afterEach, beforeEach} from "@jest/globals";
import {agent as request} from "supertest";
import {app} from "../backendRouting";


describe('non-empty suite', () => {
    test('dummy', () => {
        // Do nothing. Prevent error on missing test.
    });
});

describe.skip('real backend', () => {
    type closable =  { close: () => void; };

    let connection: closable;
    let testAgent;
    beforeEach(() => {
        connection = app.listen(3003);
        testAgent = request(connection);
    });

    afterEach(() => {
        connection.close();
    });


    test('it returns 200 OK, checked by Supertest', async () => {
        await testAgent
            .get('/api/v1/vinprovning/13')
            .expect(200);
    });

    test('it returns 200 OK, checked by Jest', async () => {
        const response = await testAgent.get('/api/v1/vinprovning/13');
        expect(response.status).toBe(200);
    });

    test('it returns the requested id', async () => {
        const response = await testAgent
            .get('/api/v1/vinprovning/14');
        expect(response.body.id).toBe(14);
    });

    test('it returns 404 when the id is invalid', async () => {
        testAgent
            .get('/api/v1/vinprovning/xyz')
            .expect(404);
    });

    // TODO: connect to a testing database, maybe mocked
    // TODO: test getting a non-existing wine tasting

});
