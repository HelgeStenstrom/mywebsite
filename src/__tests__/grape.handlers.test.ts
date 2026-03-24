import {createTestApp} from "../testUtils";
import express from "express";
import {test} from "@jest/globals";
import request from "supertest";

describe('GrapeHandlers', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });


    test('POST followed by GET returns the same Grape data', async () => {
        const putResponse = await request(app).post('/api/v1/grapes').send({name: "foo", color: "grön"});
        expect(putResponse.status).toBe(201);
        await request(app).post('/api/v1/grapes').send({name: "bar", color: "blå"});

        const getResponse = await request(app).get('/api/v1/grapes');
        expect(getResponse.status).toBe(200);

        expect(getResponse.body).toEqual([
            {id: 1, name: "foo", color: "grön", isUsed: false},
            {id: 2, name: "bar", color: "blå", isUsed: false},
        ]);

    })

    test('GET a single Grape by id', async () => {

        await request(app).post('/api/v1/grapes').send({name: "test", color: "grön"});
        await request(app).post('/api/v1/grapes').send({name: "bar", color: "blå"});

        const getResponse = await request(app).get('/api/v1/grapes/2');
        expect(getResponse.body).toEqual({id: 2, name: "bar", color: "blå", isUsed: false});
        expect(getResponse.status).toBe(200);
    })

    test('POST a Grape with invalid color returns 400', async () => {
        const response = await request(app).post('/api/v1/grapes').send({name: "test", color: "invalid"});
        expect(response.status).toBe(400);
    })

    test('PATCH by id updates the grape', async () => {
        // First post a grape
        const postResponse = await request(app)
            .post('/api/v1/grapes')
            .send({name: "before", color: "grön"});
        expect(postResponse.status).toBe(201);

        const id = postResponse.body.id;

        const patchResponse = await request(app)
            .patch(`/api/v1/grapes/${id}`)
            .send({name: "after", color: "blå"});

        expect(patchResponse.status).toBe(200);
        expect(patchResponse.body).toEqual({
            id,
            name: 'after',
            color: 'blå',
            isUsed: false,
        });

    })

    test('PATCH a Grape', async () => {
        // First post a grape
        await request(app).post('/api/v1/grapes').send({name: "before", color: "grön"});

        // Verify name and color
        const before = await request(app).get('/api/v1/grapes/1');
        expect(before.status).toBe(200);
        expect(before.body).toEqual({id: 1, color: "grön", name: "before", isUsed: false});

        // Now patch it
        await request(app).patch('/api/v1/grapes/1').send({
            id: 1,
            name: "after",
            color: "blå",
            isUsed: false,
        });

        // Verify name and color
        const after = await request(app).get('/api/v1/grapes/1');
        expect(after.status).toBe(200);
        expect(after.body).toEqual({id: 1, color: "blå", name: "after", isUsed: false});

    });

    test('isUsed is true when grape is used in a wine', async () => {
        await request(app).post('/api/v1/countries').send({ name: "Sweden" });
        await request(app).post('/api/v1/wine-types').send({ name: "rött" });
        await request(app).post('/api/v1/grapes').send({ name: "Rondo", color: "blå" });
        await request(app).post('/api/v1/wines').send({ name: "foo", countryId: 1, wineTypeId: 1 });
        await request(app).post('/api/v1/wines/1/grapes').send({ grapeId: 1 });

        const response = await request(app).get('/api/v1/grapes');
        expect(response.body).toEqual([{ id: 1, name: "Rondo", color: "blå", isUsed: true }]);
    });

    test('DELETE /grapes/:id returns 409 when grape is in use', async () => {
        await request(app).post('/api/v1/countries').send({ name: "Sweden" });
        await request(app).post('/api/v1/wine-types').send({ name: "rött" });
        await request(app).post('/api/v1/grapes').send({ name: "Rondo", color: "blå" });
        await request(app).post('/api/v1/wines').send({ name: "foo", countryId: 1, wineTypeId: 1 });
        await request(app).post('/api/v1/wines/1/grapes').send({ grapeId: 1 });

        const response = await request(app).delete('/api/v1/grapes/1');
        expect(response.status).toBe(409);
    });

});