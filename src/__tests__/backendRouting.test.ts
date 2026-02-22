import {setupEndpoints} from "../backendRouting";
import express, {Express} from "express";
import request from "supertest";
import {Orm} from "../orm";
import {Options} from "sequelize";

// TODO: Klargör syftet med denna fil, eller ta bort den. Se till att den uppfyller sitt syfte.

// Syfte: verifiera att http-anrop till endpoints returnerar förväntat data.

async function createTestApp() {
    const app = express();
    app.use(express.json());

    const sequelizeDbOptions: Options = {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    };

    const orm = new Orm('test', 'test', 'test', sequelizeDbOptions);

    await orm.sync();

    setupEndpoints(app, orm);

    return app;
}

describe('Countries endpoints', () => {
    let app;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test('POST followed by GET returns the same data', async () => {
        const response = await request(app).post('/api/v1/countries').send({name: "Sweden"});
        expect(response.status).toBe(201);

        // TODO: Read back the data from the database and verify that it is the same as the one sent in the POST.
    })
})

describe('from setupEndpoints', () => {
    test('postCountry', () => {
        const sequelizeDbOptions: Options = {dialect: 'sqlite', storage: ':memory:', logging: false};

        const router = {
            post: () => console.log('POST was called'),
            get: () => console.log('GET was called'),
            patch: () => console.log('PATCH was called'),
            delete: () => console.log('DELETE was called'),
        } as any as Express;  // From https://stackoverflow.com/questions/57964299/mocking-express-request-with-jest-and-typescript-using-correct-types
        const orm = new Orm('test', 'test', 'test', sequelizeDbOptions);
        setupEndpoints(router, orm);
    });
});

