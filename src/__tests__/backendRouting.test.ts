import express from "express";
import request from "supertest";
import {WineDto} from "../types/wine";
import {test} from "@jest/globals";
import {createTestApp, loginAs} from "../testUtils";
import {Orm} from "../orm";

// TODO: Klargör syftet med denna fil, eller ta bort den. Se till att den uppfyller sitt syfte.

// Syfte: verifiera att http-anrop till endpoints returnerar förväntat data.


describe('Table endpoints', () => {
    let app: express.Express;
    let orm: Orm;
    let cookie: string;

    beforeEach(async () => {
        ({ app, orm } = await createTestApp());
        cookie = await loginAs(app, 'test@example.com', 'secret');
    });

    afterEach(async () => {
        await orm.close();
    });

    describe('WineTypes', () => {
        test('WineTypes: POST followed by GET returns the same data', async () => {
            const putResponse = await request(app).post('/api/v1/wine-types').send({name: "blått"}).set('Cookie', cookie);
            expect(putResponse.status).toBe(201);

            const getResponse = await request(app).get('/api/v1/wine-types').set('Cookie', cookie);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual([
                {id: 1, name: "blått", isUsed: false},
            ]);
        });
    });

    describe('Wines', () => {
        async function storeCountryAndWineType() {
            await request(app).post('/api/v1/countries').send({name: "Sweden"}).set('Cookie', cookie);
            const countries = await request(app).get('/api/v1/countries').set('Cookie', cookie);
            expect(countries.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);

            await request(app).post('/api/v1/wine-types').send({name: "rött"}).set('Cookie', cookie);

            const wineTypes = await request(app).get('/api/v1/wine-types').set('Cookie', cookie);
            expect(wineTypes.body).toEqual([{id: 1, name: "rött", isUsed: false}]);
        }

        test('Wines: POST returns 201 and the created object', async () => {
            await request(app).post('/api/v1/countries').send({name: "Sweden"}).set('Cookie', cookie);
            const countries = await request(app).get('/api/v1/countries').set('Cookie', cookie);
            expect(countries.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);

            const response = await request(app).post('/api/v1/wine-types').send({name: "A wine"}).set('Cookie', cookie);
            expect(response.status).toBe(201);
            const body: WineDto = response.body;
            expect(body).toEqual({id: 1, name: "A wine", isUsed: false});
        });

        test.skip('Wines: POST followed by GET returns the same data', async () => {
            await storeCountryAndWineType();

            const putResponse = await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1, systembolaget: 523}).set('Cookie', cookie);
            expect(putResponse.status).toBe(201);

            const getResponse = await request(app).get('/api/v1/wines').set('Cookie', cookie);
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
        });

        test.skip('Wines: Returned wines have a vintage, sometimes', async () => {
            await storeCountryAndWineType();
            const putResponse = await request(app)
                .post('/api/v1/wines')
                .send({
                    name: "foo",
                    countryId: 1,
                    wineTypeId: 1,
                    systembolaget: 523,
                })
                .set('Cookie', cookie);
            expect(putResponse.status).toBe(201);
        });

        test('can create wine with vintage year', async () => {
            const country = await request(app)
                .post('/api/v1/countries')
                .send({name: 'France'})
                .set('Cookie', cookie)
                .expect(201);

            const wineType = await request(app)
                .post('/api/v1/wine-types')
                .send({name: 'Red'})
                .set('Cookie', cookie)
                .expect(201);

            await request(app)
                .post('/api/v1/wines')
                .send({
                    name: 'Testvin',
                    countryId: country.body.id,
                    wineTypeId: wineType.body.id,
                    vintageYear: 2019,
                    volume: 0,
                    systembolaget: 123,
                })
                .set('Cookie', cookie)
                .expect(201);

            const res = await request(app)
                .get('/api/v1/wines')
                .set('Cookie', cookie)
                .expect(200);

            expect(res.body[0].isNonVintage).toBe(false);
            expect(res.body[0].vintageYear).toBe(2019);
        });
    });

    describe('Tastings', () => {
        test('POST followed by GET returns the same data', async () => {
            const putResponse = await request(app)
                .post('/api/v1/tastings')
                .send({
                    title: 'Röda viner',
                    notes: 'Mycket trevligt',
                    tastingDate: "2022-01-01",
                })
                .set('Cookie', cookie);
            expect(putResponse.status).toBe(201);

            const getResponse = await request(app)
                .get('/api/v1/tastings')
                .set('Cookie', cookie);

            expect(getResponse.status).toBe(200);
            expect(getResponse.body.length).toBe(1);
            expect(getResponse.body).toEqual([{
                id: expect.any(Number),
                title: 'Röda viner',
                notes: 'Mycket trevligt',
                tastingDate: "2022-01-01",
                hosts: [],
                winningWines: [],
            }]);
        });

        test('POST with hosts followed by GET returns hosts', async () => {
            const memberResponse = await request(app)
                .post('/api/v1/members')
                .send({given: 'Nomen', surname: 'Nescio'})
                .set('Cookie', cookie);

            expect(memberResponse.status).toBe(201);
            const memberId = memberResponse.body.id;
            expect(memberId).toBe(1);

            const postResponse = await request(app)
                .post('/api/v1/tastings')
                .send({
                    title: 'Röda viner',
                    notes: 'Mycket trevligt',
                    tastingDate: '2023-07-20',
                    hostIds: [memberId],
                })
                .set('Cookie', cookie);
            expect(postResponse.status).toBe(201);

            const getResponse = await request(app)
                .get('/api/v1/tastings')
                .set('Cookie', cookie);

            expect(getResponse.body).toEqual([{
                id: expect.any(Number),
                title: 'Röda viner',
                notes: 'Mycket trevligt',
                tastingDate: "2023-07-20",
                hosts: [{memberId}],
                winningWines: [],
            }]);
        });
    });

    describe('Table interactions', () => {
        test('When a Wine uses a WineType and a Country, it shows when getting WineTypes and Countries', async () => {
            await request(app).post('/api/v1/countries').send({name: "Sweden"}).set('Cookie', cookie);
            await request(app).post('/api/v1/wine-types').send({name: "rött"}).set('Cookie', cookie);

            const countries = await request(app).get('/api/v1/countries').set('Cookie', cookie);
            const wineTypes = await request(app).get('/api/v1/wine-types').set('Cookie', cookie);
            expect(countries.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);
            expect(wineTypes.body).toEqual([{id: 1, name: "rött", isUsed: false}]);

            await request(app).post('/api/v1/wines').send({
                name: "foo",
                countryId: 1,
                wineTypeId: 1,
                systembolaget: 523,
            }).set('Cookie', cookie);

            const countries2 = await request(app).get('/api/v1/countries').set('Cookie', cookie);
            const wineTypes2 = await request(app).get('/api/v1/wine-types').set('Cookie', cookie);
            expect(countries2.body).toEqual([{id: 1, name: "Sweden", isUsed: true}]);
            expect(wineTypes2.body).toEqual([{id: 1, name: "rött", isUsed: true}]);

            await request(app).delete('/api/v1/wines/1').set('Cookie', cookie);

            const countries3 = await request(app).get('/api/v1/countries').set('Cookie', cookie);
            const wineTypes3 = await request(app).get('/api/v1/wine-types').set('Cookie', cookie);
            expect(countries3.body).toEqual([{id: 1, name: "Sweden", isUsed: false}]);
            expect(wineTypes3.body).toEqual([{id: 1, name: "rött", isUsed: false}]);
        });

        test('Trying to delete a country that is used by a wine throws an error', async () => {
            await request(app).post('/api/v1/countries').send({name: "Sweden"}).set('Cookie', cookie);
            await request(app).post('/api/v1/wine-types').send({name: "rött"}).set('Cookie', cookie);
            await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1, systembolaget: 523}).set('Cookie', cookie);

            const response = await request(app).delete('/api/v1/countries/1').set('Cookie', cookie);
            expect(response.status).toBe(409);
        });

        test('Trying to delete a wine type that is used by a wine throws an error', async () => {
            await request(app).post('/api/v1/countries').send({name: "Sweden"}).set('Cookie', cookie);
            await request(app).post('/api/v1/wine-types').send({name: "rött"}).set('Cookie', cookie);
            await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1, systembolaget: 523}).set('Cookie', cookie);

            const response = await request(app).delete('/api/v1/wine-types/1').set('Cookie', cookie);
            expect(response.status).toBe(409);
        });
    });
});