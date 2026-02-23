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

    describe('Countries', () => {
        test('Countries: POST followed by GET returns the same data', async () => {
            const putResponse = await request(app).post('/api/v1/countries').send({name: "Sweden"});
            await request(app).post('/api/v1/countries').send({name: "Norge"});
            expect(putResponse.status).toBe(201);

            const getResponse = await request(app).get('/api/v1/countries');
            expect(getResponse.status).toBe(200);

            expect(getResponse.body).toEqual([
                // Countries are returned in alphabetical order.
                {id: 2, name: "Norge", isUsed: false},
                {id: 1, name: "Sweden", isUsed: false},
            ]);

        })

        test('Countries: delete an existing country', async () => {
            const putResponse1 = await request(app).post('/api/v1/countries').send({name: "Sverige"});
            expect(putResponse1.status).toBe(201);
            const putResponse2 = await request(app).post('/api/v1/countries').send({name: "Norge"});
            expect(putResponse2.status).toBe(201);

            const deleteResponse = await request(app).delete('/api/v1/countries/1');
            expect(deleteResponse.status).toBe(204);

            const getResponse = await request(app).get('/api/v1/countries');
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual([{id: 2, name: "Norge", isUsed: false}]);

        })
    })


    describe('Grapes', () => {
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

    describe('Members', () => {

        test('Members: POST followed by GET returns the same data', async () => {
            const putResponse = await request(app).post('/api/v1/members').send({given: "a", surname: "A"});
            expect(putResponse.status).toBe(201);
            await request(app).post('/api/v1/members').send({given: "b", surname: "B"});

            const getResponse = await request(app).get('/api/v1/members');
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual([
                {id: 1, given: "a", surname: "A"},
                {id: 2, given: "b", surname: "B"},
            ]);
        })
    })

    describe('WineTypes', () => {
        test('WineTypes: POST followed by GET returns the same data', async () => {
            const putResponse = await request(app).post('/api/v1/wine-types').send({name: "blått"});
            expect(putResponse.status).toBe(201);

            const getResponse = await request(app).get('/api/v1/wine-types');
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual([
                {id: 1, name: "blått"},
            ]);


        })
    })

    describe('Wines', () => {
        test('Wines: POST followed by GET returns the same data', async () => {
            // Let's first create a country
            await request(app).post('/api/v1/countries').send({name: "Sweden"});
            // Verify
            const countries = await request(app).get('/api/v1/countries');
            expect(countries.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);

            // Then create a wine type.
            await request(app).post('/api/v1/wine-types').send({name: "rött"})

            // Verify
            const wineTypes = await request(app).get('/api/v1/wine-types');
            expect(wineTypes.body).toEqual([{id: 1, name: "rött"}])

            const putResponse = await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1, systembolaget: 523});
            expect(putResponse.status).toBe(201);

            const getResponse = await request(app).get('/api/v1/wines');
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual([
                {
                    id: 1, name: "foo", country: {
                        "id": 1,
                        "name": "Sweden",
                    }, wineType: {"id": 1, "name": "rött"}, systembolaget: 523, volume: null,
                },
            ]);

        })
    })

})
