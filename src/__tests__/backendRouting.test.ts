import {setupEndpoints} from "../backendRouting";
import express, {Express} from "express";
import request from "supertest";

// TODO: Klargör syftet med denna fil, eller ta bort den. Se till att den uppfyller sitt syfte.

// Syfte: verifiera att http-anrop till endpoints returnerar förväntat data.

function createTestApp() {
    const app = express();
    app.use(express.json());

    setupEndpoints(app, {
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });

    return app;
}

describe('Countries endpoints', () => {
    let app;

    beforeEach(async () => {
        app = createTestApp();
    });

    // TODO: Make sure the tables exist before running these tests.
    test.skip('POST followed by GET returns the same data', async () => {
        const response = await request(app).post('/api/v1/countries').send({name: "Sweden"});
        expect(response.status).toBe(201);
    })
})

describe('from setupEndpoints', () => {
    test('postCountry', () => {

        const router = {
            post: () => console.log('POST was called'),
            get: () => console.log('GET was called'),
            patch: () => console.log('PATCH was called'),
            delete: () => console.log('DELETE was called'),
        } as any as Express;  // From https://stackoverflow.com/questions/57964299/mocking-express-request-with-jest-and-typescript-using-correct-types
        setupEndpoints(router, {dialect: "sqlite",});
    });
});

