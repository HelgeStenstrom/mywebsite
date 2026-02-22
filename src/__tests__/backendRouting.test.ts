import {setupEndpoints} from "../backendRouting";
import express, {Express} from "express";
import request from "supertest";
import {Orm} from "../orm";
import {Options} from "sequelize";

// TODO: Klargör syftet med denna fil, eller ta bort den. Se till att den uppfyller sitt syfte.

// Syfte: verifiera att http-anrop till endpoints returnerar förväntat data.

async function createTestApp(): Promise<Express> {
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

describe('Table endpoints', () => {
    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test('Countries: POST followed by GET returns the same data', async () => {
        const putResponse = await request(app).post('/api/v1/countries').send({name: "Sweden"});
        await request(app).post('/api/v1/countries').send({name: "Norge"});
        expect(putResponse.status).toBe(201);

        const getResponse = await request(app).get('/api/v1/countries');
        expect(getResponse.status).toBe(200);

        expect(getResponse.body).toEqual([
            {id: 1, name: "Sweden"},
            {id: 2, name: "Norge"},
        ]);

    })

    test('Grapes: POST followed by GET returns the same data', async () => {
        const putResponse = await request(app).post('/api/v1/grapes').send({name: "foo", color: "grön"});
        expect(putResponse.status).toBe(201);
        await request(app).post('/api/v1/grapes').send({name: "bar", color: "blå"});

        const getResponse = await request(app).get('/api/v1/grapes');
        expect(getResponse.status).toBe(200);

        expect(getResponse.body).toEqual([
            {id: 1, name: "foo", color: "grön"},
            {id: 2, name: "bar", color: "blå"},
        ]);

    })

    test('Gapes: get a single grape by id', async () => {

        await request(app).post('/api/v1/grapes').send({name: "test", color: "grön"});
        await request(app).post('/api/v1/grapes').send({name: "bar", color: "blå"});

        const getResponse = await request(app).get('/api/v1/grapes/2');
        expect(getResponse.body).toEqual({id: 2, name: "bar", color: "blå"});
        expect(getResponse.status).toBe(200);
    })

    test('Grapes: put a grape with invalid color returns 400', async () => {
        const response = await request(app).post('/api/v1/grapes').send({name: "test", color: "invalid"});
        expect(response.status).toBe(400);
    })
})
