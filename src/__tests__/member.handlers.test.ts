import express from "express";
import {createTestApp} from "../testUtils";
import request from "supertest";

describe('Member handlers', () => {

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

    async function postAMember() {
        await request(app)
            .post('/api/v1/members')
            .send({
                given: 'Nomen',
                surname: 'Nescio',
            })
            .expect(201);
    }

    test('POST /members returns 201', async () => {
        await postAMember();
    })

    test('GET /members returns list of members', async () => {
        await postAMember();

        const res = await request(app)
            .get(`/api/v1/members`)
            .expect(200);

        expect(res.body.length).toBe(1);

        expect(res.body[0]).toEqual(
            {
                id: expect.any(Number),
                given: 'Nomen',
                surname: 'Nescio',
            }
        );
    })

    test('DELETE a non-existing member returns 404', async () => {
        await request(app)
            .delete(`/api/v1/members/99999`)
            .expect(404);
    })

    test('DELETE a stored member returns 204', async () => {
        await postAMember();



        await request(app)
            .delete(`/api/v1/members/1`)
            .expect(204);
    });

    test('DELETE a stored member removes it from the database', async () => {
        await postAMember()
        await request(app)
            .delete(`/api/v1/members/1`);
        const res = await request(app)
            .get(`/api/v1/members`)
            .expect(200);
        expect(res.body.length).toBe(0);
    });

    // TODO: implement the DELETE endpoint
    test.skip('It should not be possible to DELETE a member that is in use', async () => {
        await storeATasting();
        await postAMember();
        // Add the member to the tasting
        await request(app)
            .post(`/api/v1/tastings/1/members`)
            .send({
                memberId: 1,
            })
            .expect(201);
        await request(app)
            .delete(`/api/v1/members/1`)
            .expect(400);
    })

});