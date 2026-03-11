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

    test('GET wines/:id for a wine that is in a tasting, returns it marked as in use.', async () => {
        // First create a wine
        const country = await request(app)
            .post('/api/v1/countries')
            .send({ name: 'Sverige' })
            .expect(201);

        const wineType = await request(app)
            .post('/api/v1/wine-types')
            .send({ name: 'rött' })
            .expect(201);

        const wine = await request(app)
            .post('/api/v1/wines')
            .send({
                name: 'Testvin',
                countryId: country.body.id,
                wineTypeId: wineType.body.id,
                isNonVintage: false,
            })
            .expect(201);


        // also create a tasting
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({
                title: "The title",
                notes: "some notes",
                tastingDate: "2024-01-15",
            })
            .expect(201);

        // Check that it is not marked as in use
        const found = await request(app)
            .get(`/api/v1/wines/${wine.body.id}`)
            .expect(200);

        expect(found.body.isUsed).toBe(false);

        // also check the one and only wine in the tasting
        const allWines = await request(app)
        .get(`/api/v1/wines`)
        .expect(200);

        expect(allWines.body[0].isUsed).toEqual(false);

        // Put it in a tasting
        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/wines`)
            .send({
                wineId: wine.body.id,
                position: 3,
                purchasePrice: 129,
            })
            .expect(201);

        // Now it should be marked as in use
        const foundAfterTasting = await request(app)
            .get(`/api/v1/wines/${wine.body.id}`)
            .expect(200);
        expect(foundAfterTasting.body.isUsed).toBe(true);

        // also again check the one and only wine in the tasting
        const allWinesAfterTasting = await request(app)
            .get(`/api/v1/wines`)
            .expect(200);
        expect(allWinesAfterTasting.body[0].isUsed).toEqual(true);

    })

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