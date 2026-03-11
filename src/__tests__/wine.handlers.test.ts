import express from "express";
import {createTestApp} from "../testUtils";
import request from "supertest";

describe('Wine handlers test', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test.each([
        { isNonVintage: true,  vintageYear: 2019, expectedStatus: 400 },
        { isNonVintage: true,  vintageYear: null, expectedStatus: 201 },
        { isNonVintage: false, vintageYear: 2019, expectedStatus: 201 },
    ])('POST /wines with vintageYear=$vintageYear and isNonVintage=$isNonVintage returns $expectedStatus',
        async ({ isNonVintage, vintageYear, expectedStatus }) => {
            const country = await request(app)
                .post('/api/v1/countries')
                .send({ name: 'Test' })
                .expect(201);

            const wineType = await request(app)
                .post('/api/v1/wine-types')
                .send({ name: 'Test' })
                .expect(201);

            await request(app)
                .post('/api/v1/wines')
                .send({
                    name: 'Testvin',
                    countryId: country.body.id,
                    wineTypeId: wineType.body.id,
                    vintageYear,
                    isNonVintage,
                })
                .expect(expectedStatus);
        });

    test('GET /wines/:id returns the wine', async () => {
        const country = await request(app)
            .post('/api/v1/countries')
            .send({ name: 'Sverige' })
            .expect(201);

        const wineType = await request(app)
            .post('/api/v1/wine-types')
            .send({ name: 'rött' })
            .expect(201);

        const created = await request(app)
            .post('/api/v1/wines')
            .send({
                name: 'Testvin',
                countryId: country.body.id,
                wineTypeId: wineType.body.id,
                isNonVintage: false,
            })
            .expect(201);

        const found = await request(app)
            .get(`/api/v1/wines/${created.body.id}`)
            .expect(200);

        expect(found.body).toEqual(created.body);
    });

    test('GET /wines/:id returns 404 when not found', async () => {
        await request(app)
            .get('/api/v1/wines/99999')
            .expect(404);
    });

});