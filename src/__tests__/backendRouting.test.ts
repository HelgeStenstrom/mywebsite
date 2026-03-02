import {setupEndpoints} from "../backendRouting";
import express, {Express} from "express";
import request from "supertest";
import {Orm} from "../orm";
import {Options} from "sequelize";
import {CountryDto} from "../types/country";
import {WineDto} from "../types/wine";
import {test} from "@jest/globals";

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

            const body: CountryDto = getResponse.body;
            expect(body).toEqual([
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
        test('POST followed by GET returns the same Grape data', async () => {
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

        test('GET a single Grape by id', async () => {

            await request(app).post('/api/v1/grapes').send({name: "test", color: "grön"});
            await request(app).post('/api/v1/grapes').send({name: "bar", color: "blå"});

            const getResponse = await request(app).get('/api/v1/grapes/2');
            expect(getResponse.body).toEqual({id: 2, name: "bar", color: "blå"});
            expect(getResponse.status).toBe(200);
        })

        test('POST a Grape with invalid color returns 400', async () => {
            const response = await request(app).post('/api/v1/grapes').send({name: "test", color: "invalid"});
            expect(response.status).toBe(400);
        })

        test('PATCH a Grape', async () => {
            // First post a grape
            await request(app).post('/api/v1/grapes').send({name: "before", color: "grön"});

            // Verify name and color
            const before = await request(app).get('/api/v1/grapes/1');
            expect(before.status).toBe(200);
            expect(before.body).toEqual({id: 1, color: "grön", name: "before"});

            // Now patch it
            await request(app).patch('/api/v1/grapes').send({
                from: {name: "before", color: "grön"},
                to: {name: "after", color: "blå"}
            });

            // Verify name and color
            const after = await request(app).get('/api/v1/grapes/1');
            expect(after.status).toBe(200);
            expect(after.body).toEqual({id: 1, color: "blå", name: "after"});

        })

        test('PUT a Grape by ID', async () => {
            // First post a grape
            await request(app).post('/api/v1/grapes').send({name: "before", color: "grön"});

            // Verify name and color
            const before = await request(app).get('/api/v1/grapes/1');
            expect(before.status).toBe(200);
            expect(before.body).toEqual({id: 1, color: "grön", name: "before"});

            // Now put it
            const putResponse =  await request(app).put('/api/v1/grapes/1').send({name: "after", color: "blå"});
            expect(putResponse.status).toBe(204);

            // Verify name and color
            const after = await request(app).get('/api/v1/grapes/1');
            expect(after.status).toBe(200);
            expect(after.body).toEqual({id: 1, color: "blå", name: "after"});
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
                {id: 1, name: "blått", isUsed: false},
            ]);


        })
    })


    describe('Wines', () => {
        async function storeCountryAndWineType() {
            // Let's first create a country
            await request(app).post('/api/v1/countries').send({name: "Sweden"});
            // Verify
            const countries = await request(app).get('/api/v1/countries');
            expect(countries.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);

            // Then create a wine type.
            await request(app).post('/api/v1/wine-types').send({name: "rött"})

            // Verify
            const wineTypes = await request(app).get('/api/v1/wine-types');
            expect(wineTypes.body).toEqual([{id: 1, name: "rött", isUsed: false}])
        }

        test('Wines: POST returns 201 and the created object', async () => {
            // Let's first create a country and a wine type
            await request(app).post('/api/v1/countries').send({name: "Sweden"});
            const countries = await request(app).get('/api/v1/countries');
            expect(countries.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);

            const response = await request(app).post('/api/v1/wine-types').send({name: "A wine"})
            expect(response.status).toBe(201);
            const body: WineDto = response.body;
            expect(body).toEqual({id: 1, name: "A wine", isUsed: false});

        })


        // Doesn't test what the name says.
        test.skip('Wines: POST followed by GET returns the same data', async () => {
            await storeCountryAndWineType();

            const putResponse = await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1, systembolaget: 523});
            expect(putResponse.status).toBe(201);

            const getResponse = await request(app).get('/api/v1/wines');
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual([
                {
                    id: 1,
                    name: "foo",
                    country: {
                        "id": 1,
                        "name": "Sweden",
                        },
                    wineType: {"id": 1, "name": "rött"},
                    systembolaget: 523,
                    volume: null,
                    vintageYear: null,
                    isNonVintage: false,
                    createdAt: null,
                },
            ]);

        })

        // The test is not completed yet. We can't post a wine with vintageYear yet.
        test.skip('Wines: Returned wines have a vintage, sometimes', async () => {
            await storeCountryAndWineType();
            const putResponse = await request(app)
                .post('/api/v1/wines')
                .send({
                    name: "foo",
                    countryId: 1,
                    wineTypeId: 1,
                    systembolaget: 523});
            expect(putResponse.status).toBe(201);
        })

        test('can create wine with vintage year', async () => {

            const country = await request(app)
                .post('/api/v1/countries')
                .send({ name: 'France' })
                .expect(201);

            const wineType = await request(app)
                .post('/api/v1/wine-types')
                .send({ name: 'Red' })
                .expect(201);

            const res1 = await request(app)
                .post('/api/v1/wines')
                .send({
                    name: 'Testvin',
                    countryId: country.body.id,
                    wineTypeId: wineType.body.id,
                    vintageYear: 2019,
                    volume: 0,
                    systembolaget: 123,

                })
                .expect(201);

            console.log(res1.body);

            const res = await request(app)
                .get('/api/v1/wines')
                .expect(200);


            expect(res.body[0].isNonVintage).toBe(false);
            expect(res.body[0].vintageYear).toBe(2019);

        })

    })

    describe('Table interactions', () => {
        test('When a Wine uses a WineType and a Country, it shows when getting WineTypes and Countries', async () => {
            // Let's first create a country and a wine type
            await request(app).post('/api/v1/countries').send({name: "Sweden"});
            await request(app).post('/api/v1/wine-types').send({name: "rött"})

            // Verify
            const countries = await request(app).get('/api/v1/countries');
            const wineTypes = await request(app).get('/api/v1/wine-types');
            expect(countries.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);
            expect(wineTypes.body).toEqual([{id: 1, name: "rött", isUsed: false}])

            // Now create a wine that uses the country.
            await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1, systembolaget: 523});

            // Verify that the country and wine type are now used.
            const countries2 = await request(app).get('/api/v1/countries');
            const wineTypes2 = await request(app).get('/api/v1/wine-types');
            expect(countries2.body).toEqual([{id: 1, name: "Sweden", isUsed: true}]);
            expect(wineTypes2.body).toEqual([{id: 1, name: "rött", isUsed: true}]);

            // Now remove the wine.
            await request(app).delete('/api/v1/wines/1');

            // Verify that the country and wine type are no longer used.
            const countries3 = await request(app).get('/api/v1/countries');
            const wineTypes3 = await request(app).get('/api/v1/wine-types');
            expect(countries3.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);
            expect(wineTypes3.body).toEqual([{id: 1, name: "rött", isUsed: false}]);

        })

        test('Trying to delete a country that is used by a wine throws an error', async () => {
            // Let's first create a country
            await request(app).post('/api/v1/countries').send({name: "Sweden"});

            // Then create a wine type.
            await request(app).post('/api/v1/wine-types').send({name: "rött"})

            // Now create a wine that uses the country.
            await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1, systembolaget: 523});

            // Now try to delete the country. This should fail.
            const response = await request(app).delete('/api/v1/countries/1');
            expect(response.status).toBe(409);
        })

        test('Trying to delete a wine type that is used by a wine throws an error', async () => {
            // Let's first create a country
            await request(app).post('/api/v1/countries').send({name: "Sweden"});

            // Then create a wine type.
            await request(app).post('/api/v1/wine-types').send({name: "rött"})

            // Now create a wine that uses the wine type.
            await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1, systembolaget: 523});

            // Now try to delete the country. This should fail.
            const response = await request(app).delete('/api/v1/wine-types/1');
            expect(response.status).toBe(409);
        })
    })

})
