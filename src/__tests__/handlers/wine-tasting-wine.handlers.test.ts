import express from "express";
import {createTestApp} from "../../testUtils";
import request from "supertest";

async function createTasting(app: express.Express, title = 'Provning') {
    return await request(app)
        .post('/api/v1/tastings')
        .send({title: title, notes: 'noter', tastingDate: '2024-01-15'})
        .expect(201);
}


async function createCountry(app: express.Express, name = 'CountryName') {
    return await request(app)
        .post('/api/v1/countries')
        .send({name: name})
        .expect(201);
}

function createWineType(app: express.Express, name='Rött') {
    return request(app)
        .post('/api/v1/wine-types')
        .send({
            name: name,
        })
        .expect(201);
}

describe('WineTastingWine handler tests', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test('POST /tastings/:id/wines returns 201 with created wine', async () => {

        const tasting = await createTasting(app);

        const country = await createCountry(app);

        const wineType = await createWineType(app, 'rött');

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
            scoreStdDev: null,
        });
    })

    test('GET /tastings/:id/wines returns list of wines with price and score', async () => {
        const tasting = await createTasting(app);

        const country = await createCountry(app, 'Frankrike');

        const wineType = await createWineType(app);

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
            scoreStdDev: null,
        }]);
    });

    test('DELETE /tastings/:id/wines/:tastingWineId returns 404 when not found', async () => {
        await request(app)
            .delete(`/api/v1/tastings/1/wines/9999`)
            .expect(404);
    });

    test('DELETE /tastings/:id/wines/:tastingWineId returns 204', async () => {
        const tasting = await createTasting(app);

        const country = await createCountry(app, 'Test');

        const wineType = await createWineType(app);

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
        const tasting1 = await createTasting(app, 'Provning 1');

        const tasting2 = await createTasting(app, 'Provning 2');

        const country = await createCountry(app, 'Test');

        const wineType = await createWineType(app);

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
        const tasting = await createTasting(app);

        const country = await createCountry(app, 'Test');

        const wineType = await createWineType(app);

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
            .send({ averageScore: 14.5, purchasePrice: 199, position: 3 })
            .expect(200);


        // Verify
        expect(res.body).toEqual({
            id: tastingWine.body.id,
            wineId: wine.body.id,
            position: 3,
            purchasePrice: 199,
            averageScore: 14.5,
            scoreStdDev: null,
        });
    });

    test('PATCH /tastings/:id/wines/:tastingWineId returns 404 when wine belongs to different tasting', async () => {
        const tasting1 = await createTasting(app, 'Provning 1');

        const tasting2 = await createTasting(app, 'Provning 2');

        const country = await createCountry(app, 'Test');

        const wineType = await createWineType(app);

        const wine = await request(app)
            .post('/api/v1/wines')
            .send({ name: 'Testvin', countryId: country.body.id, wineTypeId: wineType.body.id })
            .expect(201);

        const tastingWine = await request(app)
            .post(`/api/v1/tastings/${tasting1.body.id}/wines`)
            .send({ wineId: wine.body.id, position: 1 })
            .expect(201);

        // Try to patch wine from different tasting
        await request(app)
            .patch(`/api/v1/tastings/${tasting2.body.id}/wines/${tastingWine.body.id}`)
            .send({ averageScore: 14.5 })
            .expect(404);
    });

    test('PATCH /tastings/:id/wines/:tastingWineId returns 404 when tastingWineId does not exist', async () => {
        const tasting = await createTasting(app);

        await request(app)
            .patch(`/api/v1/tastings/${tasting.body.id}/wines/9999`)
            .send({ averageScore: 14.5 })
            .expect(404);
    });

    test('PUT /tastings/:id/wines/positions returns 204 and updates positions', async () => {
        const tasting = await createTasting(app);
        const country = await createCountry(app);
        const wineType = await createWineType(app);

        const wine1 = await request(app)
            .post('/api/v1/wines')
            .send({ name: 'Vin 1', countryId: country.body.id, wineTypeId: wineType.body.id })
            .expect(201);

        const wine2 = await request(app)
            .post('/api/v1/wines')
            .send({ name: 'Vin 2', countryId: country.body.id, wineTypeId: wineType.body.id })
            .expect(201);

        const tw1 = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/wines`)
            .send({ wineId: wine1.body.id, position: 1 })
            .expect(201);

        const tw2 = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/wines`)
            .send({ wineId: wine2.body.id, position: 2 })
            .expect(201);

        await request(app)
            .put(`/api/v1/tastings/${tasting.body.id}/wines/positions`)
            .send([
                { id: tw1.body.id, position: 2 },
                { id: tw2.body.id, position: 1 },
            ])
            .expect(204);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting.body.id}/wines`)
            .expect(200);

        const pos = new Map(res.body.map(w => [w.id, w.position]));
        expect(pos.get(tw1.body.id)).toBe(2);
        expect(pos.get(tw2.body.id)).toBe(1);
    });
});