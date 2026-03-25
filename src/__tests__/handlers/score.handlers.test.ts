import express from "express";
import {createTestApp} from "../../testUtils";
import request from "supertest";

async function createTasting(app: express.Express, title = 'Provning') {
    return await request(app)
        .post('/api/v1/tastings')
        .send({title: title, notes: 'noter', tastingDate: '2024-01-15'})
        .expect(201);
}

describe('Score handler tests', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test('POST /tastings/:id/scores returns 201 with created score', async () => {
        const tasting = await createTasting(app);

        const res = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(Number),
            tastingId: tasting.body.id,
            memberId: 1,
            position: 1,
            score: 15,
        });
    });

    test('GET /tastings/:id/scores returns list of scores', async () => {
        const tasting = await createTasting(app);

        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .expect(201);

        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 2, position: 1, score: 17})
            .expect(201);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting.body.id}/scores`)
            .expect(200);

        expect(res.body).toEqual(expect.arrayContaining([
            {id: expect.any(Number), tastingId: tasting.body.id, memberId: 1, position: 1, score: 15},
            {id: expect.any(Number), tastingId: tasting.body.id, memberId: 2, position: 1, score: 17},
        ]));
    });

    test('GET /tastings/:id/scores returns only scores for the given tasting', async () => {
        const tasting1 = await createTasting(app, 'Provning 1');
        const tasting2 = await createTasting(app, 'Provning 2');

        await request(app)
            .post(`/api/v1/tastings/${tasting1.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .expect(201);

        await request(app)
            .post(`/api/v1/tastings/${tasting2.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 12})
            .expect(201);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting1.body.id}/scores`)
            .expect(200);

        expect(res.body.length).toEqual(1);
        expect(res.body[0].tastingId).toEqual(tasting1.body.id);
    });

    test('DELETE /tastings/:id/scores/:scoreId returns 204', async () => {
        const tasting = await createTasting(app);

        const score = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .expect(201);

        await request(app)
            .delete(`/api/v1/tastings/${tasting.body.id}/scores/${score.body.id}`)
            .expect(204);
    });

    test('DELETE /tastings/:id/scores/:scoreId returns 404 when not found', async () => {
        const tasting = await createTasting(app);

        await request(app)
            .delete(`/api/v1/tastings/${tasting.body.id}/scores/9999`)
            .expect(404);
    });

    test('PATCH /tastings/:id/scores/:scoreId returns 200 with updated score', async () => {
        const tasting = await createTasting(app);

        const score = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .expect(201);

        const res = await request(app)
            .patch(`/api/v1/tastings/${tasting.body.id}/scores/${score.body.id}`)
            .send({score: 18})
            .expect(200);

        expect(res.body).toEqual({
            id: score.body.id,
            tastingId: tasting.body.id,
            memberId: 1,
            position: 1,
            score: 18,
        });
    });

    test('PATCH /tastings/:id/scores/:scoreId returns 404 when not found', async () => {
        const tasting = await createTasting(app);

        await request(app)
            .patch(`/api/v1/tastings/${tasting.body.id}/scores/9999`)
            .send({score: 18})
            .expect(404);
    });
});