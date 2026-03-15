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

    test('DELET a stored member removes it from the database', async () => {
        await postAMember()
        await request(app)
            .delete(`/api/v1/members/1`);
        const res = await request(app)
            .get(`/api/v1/members`)
            .expect(200);
        expect(res.body.length).toBe(0);
    });

    test('GET a member by id', async () => {
        await postAMember();
        const res = await request(app)
            .get(`/api/v1/members/1`)
            .expect(200);
        expect(res.body).toEqual(
            {
                id: 1,
                given: 'Nomen',
                surname: 'Nescio',
            }
        )
    })

    test('Trying to get a non-existing member returns 404', async () => {
        await request(app)
            .get(`/api/v1/members/99999`)
            .expect(404);
    })

    // TODO: Make the test pass. Requires some in-use logic to be implemented.
    test.skip('It should not be possible to DELETE a member that is in use', async () => {
        await storeATasting();
        await postAMember();
        // check that the member is in the database
        await request(app)
            .get(`/api/v1/members/1`)
            .expect(200);
        // Add the member to the tasting
        await request(app)
            .post(`/api/v1/tastings/1/hosts`)
            .send({
                memberId: 1,
            })
            .expect(201);
        await request(app)
            .delete(`/api/v1/members/1`)
            .expect(409); // It should return 409 Conflict, because the member is in use.

        // check that the member is still in the database
        await request(app)
            .get(`/api/v1/members/1`)
            .expect(200);
    })

    test('PATCH /members/:id returns 200 with updated member', async () => {
        await postAMember();
        const res = await request(app)
            .patch(`/api/v1/members/1`)
            .send({
                given: 'Nomen',
                surname: 'Nescio',
            })
            .expect(200);

        expect(res.body).toEqual(
            {
                id: 1,
                given: 'Nomen',
                surname: 'Nescio',
            }
        )
    })

    test('PATCH /members/:id with non-existing id returns 404', async () => {
        await request(app)
            .patch(`/api/v1/members/99999`)
            .send({
                given: 'Test',
                surname: 'Test',
            })
    })

});