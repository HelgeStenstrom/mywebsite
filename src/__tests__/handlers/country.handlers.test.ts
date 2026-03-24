import express from "express";
import {createTestApp} from "../../testUtils";
import {test} from "@jest/globals";
import request from "supertest";
import {CountryDto} from "../../types/country";

describe('CountryHandlers', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test('Countries: POST followed by GET returns the same data', async () => {
        const putResponse = await request(app).post('/api/v1/countries').send({name: "Sweden"});
        await request(app).post('/api/v1/countries').send({name: "Norge"});
        expect(putResponse.status).toBe(201);

        const getResponse = await request(app).get('/api/v1/countries');
        expect(getResponse.status).toBe(200);

        const body: CountryDto = getResponse.body;
        expect(body).toEqual([
            // Countries are returned in alphabetical order.
            {id: 2, name: "Norge", isUsed: false},
            {id: 1, name: "Sweden", isUsed: false},
        ]);

    })

    test('Countries: delete an existing country', async () => {
        const putResponse1 = await request(app).post('/api/v1/countries').send({name: "Sverige"});
        expect(putResponse1.status).toBe(201);
        const putResponse2 = await request(app).post('/api/v1/countries').send({name: "Norge"});
        expect(putResponse2.status).toBe(201);

        const deleteResponse = await request(app).delete('/api/v1/countries/1');
        expect(deleteResponse.status).toBe(204);

        const getResponse = await request(app).get('/api/v1/countries');
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual([{id: 2, name: "Norge", isUsed: false}]);

    })
});