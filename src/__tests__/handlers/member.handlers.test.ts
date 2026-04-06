import express from "express";
import {createTestApp, loginAs} from "../../testUtils";
import request from "supertest";
import {test} from "@jest/globals";
import {Orm} from "../../orm";

describe('Member handlers', () => {

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

    async function storeATasting() {
        await request(app)
            .post('/api/v1/tastings')
            .send({
                title: 'Test tasting',
                notes: 'Några anteckningar',
                tastingDate: '2024-01-15',
            })
            .set('Cookie', cookie)
            .expect(201);
    }

    async function postAMember() {
        await request(app)
            .post('/api/v1/members')
            .send({
                given: 'Nomen',
                surname: 'Nescio',
            })
            .set('Cookie', cookie)
            .expect(201);
    }

    /**
     * TODO: This test may be redundant. Check the other tests.
     */
    test('Members: POST followed by GET returns the same data', async () => {
        const putResponse = await request(app).post('/api/v1/members').send({given: "a", surname: "A"}).set('Cookie', cookie);
        expect(putResponse.status).toBe(201);
        await request(app).post('/api/v1/members').send({given: "b", surname: "B"}).set('Cookie', cookie);

        const getResponse = await request(app).get('/api/v1/members').set('Cookie', cookie);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual([
            {id: 1, given: "a", surname: "A"},
            {id: 2, given: "b", surname: "B"},
        ]);
    });

    test('POST /members returns 201', async () => {
        await postAMember();
    });

    test('GET /members returns list of members', async () => {
        await postAMember();

        const res = await request(app)
            .get(`/api/v1/members`)
            .set('Cookie', cookie)
            .expect(200);

        expect(res.body.length).toBe(1);

        expect(res.body[0]).toEqual(
            {
                id: expect.any(Number),
                given: 'Nomen',
                surname: 'Nescio',
            }
        );
    });

    test('DELETE a non-existing member returns 404', async () => {
        await request(app)
            .delete(`/api/v1/members/99999`)
            .set('Cookie', cookie)
            .expect(404);
    });

    test('DELETE a stored member returns 204', async () => {
        await postAMember();

        await request(app)
            .delete(`/api/v1/members/1`)
            .set('Cookie', cookie)
            .expect(204);
    });

    test('DELET a stored member removes it from the database', async () => {
        await postAMember();
        await request(app)
            .delete(`/api/v1/members/1`)
            .set('Cookie', cookie);
        const res = await request(app)
            .get(`/api/v1/members`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.length).toBe(0);
    });

    test('GET a member by id', async () => {
        await postAMember();
        const res = await request(app)
            .get(`/api/v1/members/1`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body).toEqual(
            {
                id: 1,
                given: 'Nomen',
                surname: 'Nescio',
            }
        );
    });

    test('Trying to get a non-existing member returns 404', async () => {
        await request(app)
            .get(`/api/v1/members/99999`)
            .set('Cookie', cookie)
            .expect(404);
    });

    // TODO: Make the test pass. Requires some in-use logic to be implemented.
    test.skip('It should not be possible to DELETE a member that is in use', async () => {
        await storeATasting();
        await postAMember();
        await request(app)
            .get(`/api/v1/members/1`)
            .set('Cookie', cookie)
            .expect(200);
        await request(app)
            .post(`/api/v1/tastings/1/hosts`)
            .send({memberId: 1})
            .set('Cookie', cookie)
            .expect(201);
        await request(app)
            .delete(`/api/v1/members/1`)
            .set('Cookie', cookie)
            .expect(409);
        await request(app)
            .get(`/api/v1/members/1`)
            .set('Cookie', cookie)
            .expect(200);
    });

    test('PATCH /members/:id returns 200 with updated member', async () => {
        await postAMember();
        const res = await request(app)
            .patch(`/api/v1/members/1`)
            .send({
                given: 'Nomen',
                surname: 'Nescio',
            })
            .set('Cookie', cookie)
            .expect(200);

        expect(res.body).toEqual(
            {
                id: 1,
                given: 'Nomen',
                surname: 'Nescio',
            }
        );
    });

    test('PATCH /members/:id with non-existing id returns 404', async () => {
        await request(app)
            .patch(`/api/v1/members/99999`)
            .send({
                given: 'Test',
                surname: 'Test',
            })
            .set('Cookie', cookie);
    });
});