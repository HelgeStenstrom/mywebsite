import {createTestApp, loginAs} from "../../testUtils";
import express from "express";
import {test} from "@jest/globals";
import request from "supertest";
import {Orm} from "../../orm";

describe('GrapeHandlers', () => {

    let app: express.Express;
    let orm: Orm;
    let cookie: string;

    beforeEach(async () => {
        ({ app, orm } = await createTestApp());
        cookie = await loginAs(app, 'test@example.com', 'secret');
    });

    afterEach(async () => {
        await orm.close();
    });

    test('POST followed by GET returns the same Grape data', async () => {
        const putResponse = await request(app).post('/api/v1/grapes').send({name: "foo", color: "grön"}).set('Cookie', cookie);
        expect(putResponse.status).toBe(201);
        await request(app).post('/api/v1/grapes').send({name: "bar", color: "blå"}).set('Cookie', cookie);

        const getResponse = await request(app).get('/api/v1/grapes').set('Cookie', cookie);
        expect(getResponse.status).toBe(200);

        expect(getResponse.body).toEqual([
            {id: 1, name: "foo", color: "grön", isUsed: false},
            {id: 2, name: "bar", color: "blå", isUsed: false},
        ]);
    });

    test('GET a single Grape by id', async () => {
        await request(app).post('/api/v1/grapes').send({name: "test", color: "grön"}).set('Cookie', cookie);
        await request(app).post('/api/v1/grapes').send({name: "bar", color: "blå"}).set('Cookie', cookie);

        const getResponse = await request(app).get('/api/v1/grapes/2').set('Cookie', cookie);
        expect(getResponse.body).toEqual({id: 2, name: "bar", color: "blå", isUsed: false});
        expect(getResponse.status).toBe(200);
    });

    test('POST a Grape with invalid color returns 400', async () => {
        const response = await request(app).post('/api/v1/grapes').send({name: "test", color: "invalid"}).set('Cookie', cookie);
        expect(response.status).toBe(400);
    });

    test('PATCH by id updates the grape', async () => {
        const postResponse = await request(app)
            .post('/api/v1/grapes')
            .send({name: "before", color: "grön"})
            .set('Cookie', cookie);
        expect(postResponse.status).toBe(201);

        const id = postResponse.body.id;

        const patchResponse = await request(app)
            .patch(`/api/v1/grapes/${id}`)
            .send({name: "after", color: "blå"})
            .set('Cookie', cookie);

        expect(patchResponse.status).toBe(200);
        expect(patchResponse.body).toEqual({
            id,
            name: 'after',
            color: 'blå',
            isUsed: false,
        });
    });

    test('PATCH a Grape', async () => {
        await request(app).post('/api/v1/grapes').send({name: "before", color: "grön"}).set('Cookie', cookie);

        const before = await request(app).get('/api/v1/grapes/1').set('Cookie', cookie);
        expect(before.status).toBe(200);
        expect(before.body).toEqual({id: 1, color: "grön", name: "before", isUsed: false});

        await request(app).patch('/api/v1/grapes/1').send({
            id: 1,
            name: "after",
            color: "blå",
            isUsed: false,
        }).set('Cookie', cookie);

        const after = await request(app).get('/api/v1/grapes/1').set('Cookie', cookie);
        expect(after.status).toBe(200);
        expect(after.body).toEqual({id: 1, color: "blå", name: "after", isUsed: false});
    });

    test('isUsed is true when grape is used in a wine', async () => {
        await request(app).post('/api/v1/countries').send({name: "Sweden"}).set('Cookie', cookie);
        await request(app).post('/api/v1/wine-types').send({name: "rött"}).set('Cookie', cookie);
        await request(app).post('/api/v1/grapes').send({name: "Rondo", color: "blå"}).set('Cookie', cookie);
        await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1}).set('Cookie', cookie);
        await request(app).post('/api/v1/wines/1/grapes').send({grapeId: 1}).set('Cookie', cookie);

        const response = await request(app).get('/api/v1/grapes').set('Cookie', cookie);
        expect(response.body).toEqual([{id: 1, name: "Rondo", color: "blå", isUsed: true}]);
    });

    test('DELETE /grapes/:id returns 409 when grape is in use', async () => {
        await request(app).post('/api/v1/countries').send({name: "Sweden"}).set('Cookie', cookie);
        await request(app).post('/api/v1/wine-types').send({name: "rött"}).set('Cookie', cookie);
        await request(app).post('/api/v1/grapes').send({name: "Rondo", color: "blå"}).set('Cookie', cookie);
        await request(app).post('/api/v1/wines').send({name: "foo", countryId: 1, wineTypeId: 1}).set('Cookie', cookie);
        await request(app).post('/api/v1/wines/1/grapes').send({grapeId: 1}).set('Cookie', cookie);

        const response = await request(app).delete('/api/v1/grapes/1').set('Cookie', cookie);
        expect(response.status).toBe(409);
    });

    describe('Wines of the grape', () => {

        test('GET /grapes/:id/wines returns 404 when grape does not exist', async () => {

            const response = await request(app).get('/api/v1/grapes/4711/wines').set('Cookie', cookie);

            expect(response.status).toBe(404);
        });

        test('GET /grapes/:id/wines returns empty list when grape exists but has no wines', async () => {
            await request(app).post('/api/v1/grapes').send({ name: 'Testdruva', color: 'blå' }).set('Cookie', cookie);

            const response = await request(app).get('/api/v1/grapes/1/wines').set('Cookie', cookie);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        // Vänta på fix i wines repository.
        test.skip('GET /grapes/:id/wines returns wines that contain the grape', async () => {
            const grapeRes = await request(app).post('/api/v1/grapes').send({ name: 'Testdruva', color: 'blå' }).set('Cookie', cookie);
            const grapeId = grapeRes.body.id;

            const countryRes = await request(app).post('/api/v1/countries').send({ name: 'Testland' }).set('Cookie', cookie);
            const countryId = countryRes.body.id;

            const wineTypeRes = await request(app).post('/api/v1/wine-types').send({ name: 'Rött' }).set('Cookie', cookie);
            const wineTypeId = wineTypeRes.body.id;

            const wineRes = await request(app).post('/api/v1/wines').send({ name: 'Testvin', countryId, wineTypeId }).set('Cookie', cookie);
            const wineId = wineRes.body.id;

            const postResponse = await request(app).post(`/api/v1/wines/${wineId}/grapes`).send({ grapeId }).set('Cookie', cookie).expect(201);
            console.log('postResponse.body: ' + JSON.stringify(postResponse.body));

            const response = await request(app).get(`/api/v1/grapes/${grapeId}/wines`).set('Cookie', cookie);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].id).toBe(wineId);
            expect(response.body[0].name).toBe('Testvin');
        });



    })
});