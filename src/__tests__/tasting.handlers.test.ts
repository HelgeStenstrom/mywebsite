import {createTestApp} from "../testUtils";
import express from "express";
import request from "supertest";

describe('TastingHandlers', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });


    async function storeATasting() {
        await request(app)
            .post('/api/v1/tastings')
            .send({
                title: 'Test tasting',
                notes: 'Några anteckningar',
                tastingDate: '2024-01-15',
            })
            .expect(201);
    }

    test('POST /tastings returns 201', async () => {
        await storeATasting();
    })

    test('GET retrieves a stored tasting', async () => {
        await storeATasting();

        const tastings = await request(app)
            .get(`/api/v1/tastings`)
            .expect(200);

        expect(tastings.body.length).toBe(1);
        expect(tastings.body[0]).toEqual({
            id: 1,
            title: 'Test tasting',
            notes: 'Några anteckningar',
            tastingDate: '2024-01-15',
            hosts: [],
        })
    })

    test('DELETE a non-existing tasting returns 404', async () => {
        await request(app)
            .delete(`/api/v1/tastings/99999`)
            .expect(404);
    })

    test('DELETE a stored tasting returns 204', async () => {
        await storeATasting();
        await request(app)
            .delete(`/api/v1/tastings/1`)
            .expect(204);
    });

    test('DELETE a stored tasting removes it from the database', async () => {
        await storeATasting();
        await request(app)
            .delete(`/api/v1/tastings/1`);
        const tastings = await request(app)
            .get(`/api/v1/tastings`)
            .expect(200);
        expect(tastings.body.length).toBe(0);
    });

});