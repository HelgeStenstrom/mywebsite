import express from "express";
import {createTestApp, loginAs} from "../../testUtils";
import request from "supertest";
import {Orm} from "../../orm";

async function createTasting(app: express.Express, cookie: string, title = 'Provning') {
    return await request(app)
        .post('/api/v1/tastings')
        .send({title: title, notes: 'noter', tastingDate: '2024-01-15'})
        .set('Cookie', cookie)
        .expect(201);
}

describe('Score handler tests', () => {

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

    test('POST /tastings/:id/scores returns 201 with created score', async () => {
        const tasting = await createTasting(app, cookie);

        const res = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .set('Cookie', cookie)
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
        const tasting = await createTasting(app, cookie);

        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .set('Cookie', cookie)
            .expect(201);

        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 2, position: 1, score: 17})
            .set('Cookie', cookie)
            .expect(201);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting.body.id}/scores`)
            .set('Cookie', cookie)
            .expect(200);

        expect(res.body).toEqual(expect.arrayContaining([
            {id: expect.any(Number), tastingId: tasting.body.id, memberId: 1, position: 1, score: 15},
            {id: expect.any(Number), tastingId: tasting.body.id, memberId: 2, position: 1, score: 17},
        ]));
    });

    test('GET /tastings/:id/scores returns only scores for the given tasting', async () => {
        const tasting1 = await createTasting(app, cookie, 'Provning 1');
        const tasting2 = await createTasting(app, cookie, 'Provning 2');

        await request(app)
            .post(`/api/v1/tastings/${tasting1.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .set('Cookie', cookie)
            .expect(201);

        await request(app)
            .post(`/api/v1/tastings/${tasting2.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 12})
            .set('Cookie', cookie)
            .expect(201);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting1.body.id}/scores`)
            .set('Cookie', cookie)
            .expect(200);

        expect(res.body.length).toEqual(1);
        expect(res.body[0].tastingId).toEqual(tasting1.body.id);
    });

    test('DELETE /tastings/:id/scores/:scoreId returns 204', async () => {
        const tasting = await createTasting(app, cookie);

        const score = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .set('Cookie', cookie)
            .expect(201);

        await request(app)
            .delete(`/api/v1/tastings/${tasting.body.id}/scores/${score.body.id}`)
            .set('Cookie', cookie)
            .expect(204);
    });

    test('DELETE /tastings/:id/scores/:scoreId returns 404 when not found', async () => {
        const tasting = await createTasting(app, cookie);

        await request(app)
            .delete(`/api/v1/tastings/${tasting.body.id}/scores/9999`)
            .set('Cookie', cookie)
            .expect(404);
    });

    test('PATCH /tastings/:id/scores/:scoreId returns 200 with updated score', async () => {
        const tasting = await createTasting(app, cookie);

        const score = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/scores`)
            .send({memberId: 1, position: 1, score: 15})
            .set('Cookie', cookie)
            .expect(201);

        const res = await request(app)
            .patch(`/api/v1/tastings/${tasting.body.id}/scores/${score.body.id}`)
            .send({score: 18})
            .set('Cookie', cookie)
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
        const tasting = await createTasting(app, cookie);

        await request(app)
            .patch(`/api/v1/tastings/${tasting.body.id}/scores/9999`)
            .send({score: 18})
            .set('Cookie', cookie)
            .expect(404);
    });

    describe('PUT /tastings/:id/scores', () => {

        test('PUT /tastings/:id/scores replaces all scores', async () => {
            const tasting = await createTasting(app, cookie);

            await request(app)
                .post(`/api/v1/tastings/${tasting.body.id}/scores`)
                .send({memberId: 1, position: 1, score: 15})
                .set('Cookie', cookie)
                .expect(201);

            await request(app)
                .post(`/api/v1/tastings/${tasting.body.id}/scores`)
                .send({memberId: 2, position: 1, score: 12})
                .set('Cookie', cookie)
                .expect(201);

            const res = await request(app)
                .put(`/api/v1/tastings/${tasting.body.id}/scores`)
                .send([
                    {memberId: 1, position: 1, score: 18},
                    {memberId: 3, position: 2, score: 14},
                ])
                .set('Cookie', cookie)
                .expect(200);

            expect(res.body).toHaveLength(2);
            expect(res.body).toEqual(expect.arrayContaining([
                {id: expect.any(Number), tastingId: tasting.body.id, memberId: 1, position: 1, score: 18},
                {id: expect.any(Number), tastingId: tasting.body.id, memberId: 3, position: 2, score: 14},
            ]));
        });

        test('PUT /tastings/:id/scores with empty array removes all scores', async () => {
            const tasting = await createTasting(app, cookie);

            await request(app)
                .post(`/api/v1/tastings/${tasting.body.id}/scores`)
                .send({memberId: 1, position: 1, score: 15})
                .set('Cookie', cookie)
                .expect(201);

            const res = await request(app)
                .put(`/api/v1/tastings/${tasting.body.id}/scores`)
                .send([])
                .set('Cookie', cookie)
                .expect(200);

            expect(res.body).toHaveLength(0);
        });
    });
});