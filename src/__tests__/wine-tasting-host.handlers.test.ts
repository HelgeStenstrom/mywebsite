import express from "express";
import {createTestApp} from "../testUtils";
import request from "supertest";

describe('WineTastingHostHandlers', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test('POST /tastings/:id/hosts returns 201 with created host', async () => {
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({
                title: 'Test tasting',
                notes: 'Några anteckningar',
                tastingDate: '2024-01-15',
            })
            .expect(201);

        const member = await request(app)
            .post('/api/v1/members')
            .send({
                given: 'Test',
                surname: 'Testsson',
            })
            .expect(201);

        const res = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .send({
                memberId: member.body.id,
            })
            .expect(201);

        expect(res.body).toEqual({
            memberId: member.body.id,
        });
    })

    test('GET /tastings/:id/hosts returns list of hosts', async () => {
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({
                title: 'Test tasting',
                notes: 'Några anteckningar',
                tastingDate: '2024-01-15',
            })
            .expect(201);

        const member = await request(app)
            .post('/api/v1/members')
            .send({
                given: 'Test',
                surname: 'Testsson',
            })
            .expect(201);

        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .send({
                memberId: member.body.id,
            })
            .expect(201);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .expect(200);

        expect(res.body).toEqual([{
            memberId: member.body.id,
        }]);

    })

})