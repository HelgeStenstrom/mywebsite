import express from "express";
import {createTestApp} from "../../testUtils";
import request from "supertest";

describe('WineGrape handler tests', () => {

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

        return await request(app)
            .post('/api/v1/wines')
            .send({
                name: 'Testvin',
                countryId: country.body.id,
                wineTypeId: wineType.body.id,
                isNonVintage: false,
            })
            .expect(201);
    }

    async function postAGrape() {
        return await request(app)
            .post('/api/v1/grapes')
            .send({name: 'Pinot Noir', color: 'blå'})
            .expect(201);
    }

    test('POST /wines/:id/grapes returns 201 with created wine grape', async () => {
        const wine = await postAWine();
        const grape = await postAGrape();

        const res = await request(app)
            .post(`/api/v1/wines/${wine.body.id}/grapes`)
            .send({
                grapeId: grape.body.id,
                percentage: 75.5,
            })
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(Number),
            wineId: wine.body.id,
            grapeId: grape.body.id,
            percentage: 75.5,
        });
    });

    test('GET /wines/:id/grapes returns list of grapes', async () => {
        const wine = await postAWine();
        const grape = await postAGrape();

        await request(app)
            .post(`/api/v1/wines/${wine.body.id}/grapes`)
            .send({
                grapeId: grape.body.id,
                percentage: 75.5,
            })
            .expect(201);

        const res = await request(app)
            .get(`/api/v1/wines/${wine.body.id}/grapes`)
            .expect(200);

        expect(res.body).toEqual([{
            id: expect.any(Number),
            wineId: wine.body.id,
            grapeId: grape.body.id,
            percentage: 75.5,
        }]);
    });

    test('POST /wines/:id/grapes without percentage returns null for percentage', async () => {
        const wine = await postAWine();
        const grape = await postAGrape();

        const res = await request(app)
            .post(`/api/v1/wines/${wine.body.id}/grapes`)
            .send({grapeId: grape.body.id})
            .expect(201);

        expect(res.body.percentage).toBeNull();
    });

    test('DELETE a non-existing wine grape returns 404', async () => {
        const wineWithoutGrapes = await postAWine();

        await request(app)
            .delete(`/api/v1/wines/${wineWithoutGrapes.body.id}/grapes/99999`)
            .expect(404);
    });

    test('DELETE a wine grape returns 204', async () => {
        const wine = await postAWine();
        const grape = await postAGrape();

        const res = await request(app)
            .post(`/api/v1/wines/${wine.body.id}/grapes`)
            .send({
                grapeId: grape.body.id,
                percentage: 75.5,
            })
            .expect(201);

        await request(app)
            .delete(`/api/v1/wines/${wine.body.id}/grapes/${res.body.id}`)
            .expect(204);
    });

    test('DELETE a wine grape removes the grape from the wine', async () => {
        const wine = await postAWine();
        const grape = await postAGrape();
        const wineGrape = await request(app)
            .post(`/api/v1/wines/${wine.body.id}/grapes`)
            .send({
                grapeId: grape.body.id,
                percentage: 75.5,
            })
            .expect(201);

        const res = await request(app)
            .delete(`/api/v1/wines/${wine.body.id}/grapes/${wineGrape.body.id}`)
            .expect(204);

        const found = await request(app)
            .get(`/api/v1/wines/${wine.body.id}`)
            .expect(200);

        expect(found.body.grapes).toEqual([]);

    })
});