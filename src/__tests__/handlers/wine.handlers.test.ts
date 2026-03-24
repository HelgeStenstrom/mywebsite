import express from "express";
import {createTestApp} from "../../testUtils";
import request from "supertest";

describe('Wine handlers test', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    async function postAWine() {
        const country = await request(app)
            .post('/api/v1/countries')
            .send({name: 'Sverige'})
            .expect(201);

        const wineType = await request(app)
            .post('/api/v1/wine-types')
            .send({name: 'rött'})
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
        return wine;
    }

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
        const wine = await postAWine();


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
        const created = await postAWine();

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


    test('PATCH /wines/:id returns 404 when not found', async () => {
        await request(app)
            .patch('/api/v1/wines/99999')
            .send({name: 'test'})
            .expect(404);
    });

    test('PATCH /wines/:id returns 200 with updated wine', async () => {
        const created = await postAWine();

        const res = await request(app)
            .patch(`/api/v1/wines/${created.body.id}`)
            .send({name: 'New name'})
            .expect(200);

        expect(res.body.name).toBe('New name');
    })

    test('PATCH /wines/:id can add vintageYear', async () => {
        const created = await postAWine();
        const res = await request(app)
            .patch(`/api/v1/wines/${created.body.id}`)
            .send({vintageYear: 2020})
            .expect(200);

        expect(res.body.vintageYear).toBe(2020);

    })


    test('GET /wines/:id returns grapes for the wine', async () => {
        const wine = await postAWine();

        const grape = await request(app)
            .post('/api/v1/grapes')
            .send({name: 'Pinot Noir', color: 'blå'})
            .expect(201);

        await request(app)
            .post(`/api/v1/wines/${wine.body.id}/grapes`)
            .send({
                grapeId: grape.body.id,
                percentage: 75.5,
            })
            .expect(201);

        const found = await request(app)
            .get(`/api/v1/wines/${wine.body.id}`)
            .expect(200);

        expect(found.body.grapes).toEqual([{
            id: expect.any(Number),
            wineId: wine.body.id,
            grapeId: grape.body.id,
            percentage: 75.5,
        }]);
    });

});