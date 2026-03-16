import express from "express";
import {createTestApp} from "../testUtils";
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
});