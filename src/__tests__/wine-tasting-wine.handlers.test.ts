import express from "express";
import {createTestApp} from "../testUtils";
import request from "supertest";

describe('WineTastingWine handler tests', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test('POST /tastings/:id/wines returns 201 with created wine', async () => {

        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({
                title: 'Test tasting' ,
                notes: 'Några anteckningar',
                tastingDate: '2024-01-15',
                })
            .expect(201);

        const country = await request(app)
            .post('/api/v1/countries')
            .send({
                name: 'Test' ,
            })
            .expect(201);

        const wineType = await request(app)
            .post('/api/v1/wine-types')
            .send({
                name: 'rött' ,
            })
            .expect(201);

        const wine = await request(app)
            .post('/api/v1/wines')
            .send({
                name: 'Testvin',
                countryId: country.body.id,
                wineTypeId: wineType.body.id,
                systembolaget: 123,
            })
            .expect(201);

        const res = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/wines`)
            .send({
                wineId: wine.body.id,
                position: 1,
                purchasePrice: 129,
            })
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(Number),
            wineId: wine.body.id,
            position: 1,
            purchasePrice: 129,
            averageScore: null,
        });
    })

    test('GET /tastings/:id/wines returns list of wines with price and score', async () => {
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({
                title: 'Test provning',
                notes: 'Några anteckningar',
                tastingDate: '2024-01-15',
            })
            .expect(201);

        const country = await request(app)
            .post('/api/v1/countries')
            .send({name: 'Frankrike'})
            .expect(201);

        const wineType = await request(app)
            .post('/api/v1/wine-types')
            .send({name: 'Rött'})
            .expect(201);

        const wine = await request(app)
            .post('/api/v1/wines')
            .send({
                name: 'Testvin',
                countryId: country.body.id,
                wineTypeId: wineType.body.id,
            })
            .expect(201);

        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/wines`)
            .send({
                wineId: wine.body.id,
                position: 1,
                purchasePrice: 129,
                averageScore: 13.1,
            })
            .expect(201);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting.body.id}/wines`)
            .expect(200);

        expect(res.body).toEqual([{
            id: expect.any(Number),
            wineId: wine.body.id,
            position: 1,
            purchasePrice: 129,
            averageScore: 13.1,
        }]);
    });

    test('DELETE /tastings/:id/wines/:tastingWineId returns 404 when not found', async () => {
        await request(app)
            .delete(`/api/v1/tastings/1/wines/9999`)
            .expect(404);
    });

    test('DELETE /tastings/:id/wines/:tastingWineId returns 204', async () => {
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({ title: 'Test tasting', notes: 'Anteckningar', tastingDate: '2024-01-15' })
            .expect(201);

        const country = await request(app)
            .post('/api/v1/countries')
            .send({ name: 'Test' })
            .expect(201);

        const wineType = await request(app)
            .post('/api/v1/wine-types')
            .send({ name: 'Rött' })
            .expect(201);

        const wine = await request(app)
            .post('/api/v1/wines')
            .send({ name: 'Testvin', countryId: country.body.id, wineTypeId: wineType.body.id })
            .expect(201);

        const tastingWine = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/wines`)
            .send({ wineId: wine.body.id, position: 1 })
            .expect(201);

        await request(app)
            .delete(`/api/v1/tastings/${tasting.body.id}/wines/${tastingWine.body.id}`)
            .expect(204);
    });

    test('DELETE /tastings/:id/wines/:tastingWineId returns 404 when wine belongs to different tasting', async () => {
        const tasting1 = await request(app)
            .post('/api/v1/tastings')
            .send({ title: 'Provning 1', notes: '', tastingDate: '2024-01-15' })
            .expect(201);

        console.log('status:', tasting1.status);
        console.log('body:', tasting1.body);

        const tasting2 = await request(app)
            .post('/api/v1/tastings')
            .send({ title: 'Provning 2', notes: '', tastingDate: '2024-01-16' })
            .expect(201);

        const country = await request(app)
            .post('/api/v1/countries')
            .send({ name: 'Test' })
            .expect(201);

        const wineType = await request(app)
            .post('/api/v1/wine-types')
            .send({ name: 'Rött' })
            .expect(201);

        const wine = await request(app)
            .post('/api/v1/wines')
            .send({ name: 'Testvin', countryId: country.body.id, wineTypeId: wineType.body.id })
            .expect(201);

        const tastingWine = await request(app)
            .post(`/api/v1/tastings/${tasting1.body.id}/wines`)
            .send({ wineId: wine.body.id, position: 1 })
            .expect(201);

        await request(app)
            .delete(`/api/v1/tastings/${tasting2.body.id}/wines/${tastingWine.body.id}`)
            .expect(404);
    });


    test('PATCH /tastings/:id/wines/:tastingWineId returns 200 with updated wine', async () => {
        // Setup
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({ title: 'Test tasting', notes: 'Anteckningar', tastingDate: '2024-01-15' })
            .expect(201);

        const country = await request(app)
            .post('/api/v1/countries')
            .send({ name: 'Test' })
            .expect(201);

        const wineType = await request(app)
            .post('/api/v1/wine-types')
            .send({ name: 'Rött' })
            .expect(201);

        const wine = await request(app)
            .post('/api/v1/wines')
            .send({ name: 'Testvin', countryId: country.body.id, wineTypeId: wineType.body.id })
            .expect(201);

        const tastingWine = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/wines`)
            .send({ wineId: wine.body.id, position: 1 })
            .expect(201);


        // Exercise
        const res = await request(app)
            .patch(`/api/v1/tastings/${tasting.body.id}/wines/${tastingWine.body.id}`)
            .send({ averageScore: 14.5, purchasePrice: 199, position: 5 })
            .expect(200);


        // Verify
        expect(res.body).toEqual({
            id: tastingWine.body.id,
            wineId: wine.body.id,
            position: 5,
            purchasePrice: 199,
            averageScore: 14.5,
        });
    });

});