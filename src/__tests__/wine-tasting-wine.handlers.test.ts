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

});