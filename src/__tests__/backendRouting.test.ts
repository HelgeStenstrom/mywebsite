import express from "express";
import request from "supertest";
import {WineDto} from "../types/wine";
import {test} from "@jest/globals";
import {createTestApp} from "../testUtils";

// TODO: Klargör syftet med denna fil, eller ta bort den. Se till att den uppfyller sitt syfte.

// Syfte: verifiera att http-anrop till endpoints returnerar förväntat data.


describe('Table endpoints', () => {
    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

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

            const res = await request(app)
                .get('/api/v1/wines')
                .expect(200);


            expect(res.body[0].isNonVintage).toBe(false);
            expect(res.body[0].vintageYear).toBe(2019);

        })

    })

    describe('Tastings', () => {
        test('POST followed by GET returns the same data', async () => {
            const putResponse = await request(app)
                .post('/api/v1/tastings')
                .send({
                    title: 'Röda viner',
                    notes: 'Mycket trevligt',
                    tastingDate: "2022-01-01",
                });
            expect(putResponse.status).toBe(201);

            const getResponse = await request(app)
                .get('/api/v1/tastings');

            expect(getResponse.status).toBe(200);
            expect(getResponse.body.length).toBe(1);
            expect(getResponse.body).toEqual([{
                id: expect.any(Number),
                title: 'Röda viner',
                notes: 'Mycket trevligt',
                tastingDate: "2022-01-01",
                hosts: [],
            }])
        });

        test('POST with hosts followed by GET returns hosts', async () => {
            const memberResponse = await request(app)
                .post('/api/v1/members')
                .send({ given: 'Nomen', surname: 'Nescio' });

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
                });
            expect(postResponse.status).toBe(201);


            const getResponse = await request(app)
                .get('/api/v1/tastings');

            expect(getResponse.body).toEqual([{
                id: expect.any(Number),
                title: 'Röda viner',
                notes: 'Mycket trevligt',
                tastingDate: "2023-07-20",
                hosts: [{memberId}],
            }])

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
            await request(app).post('/api/v1/wines').send({
                name: "foo",
                countryId: 1,
                wineTypeId: 1,
                systembolaget: 523
            });

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

        });

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
