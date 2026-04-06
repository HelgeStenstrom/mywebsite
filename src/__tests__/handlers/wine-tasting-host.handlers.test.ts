import express from "express";
import {createTestApp, loginAs} from "../../testUtils";
import request from "supertest";
import {Orm} from "../../orm";

describe('WineTastingHostHandlers', () => {

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

    test('POST /tastings/:id/hosts returns 201 with created host', async () => {
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({
                title: 'Test tasting',
                notes: 'Några anteckningar',
                tastingDate: '2024-01-15',
            })
            .set('Cookie', cookie)
            .expect(201);

        const member = await request(app)
            .post('/api/v1/members')
            .send({
                given: 'Test',
                surname: 'Testsson',
            })
            .set('Cookie', cookie)
            .expect(201);

        const res = await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .send({memberId: member.body.id})
            .set('Cookie', cookie)
            .expect(201);

        expect(res.body).toEqual({
            memberId: member.body.id,
        });
    });

    test('GET /tastings/:id/hosts returns list of hosts', async () => {
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({
                title: 'Test tasting',
                notes: 'Några anteckningar',
                tastingDate: '2024-01-15',
            })
            .set('Cookie', cookie)
            .expect(201);

        const member = await request(app)
            .post('/api/v1/members')
            .send({
                given: 'Test',
                surname: 'Testsson',
            })
            .set('Cookie', cookie)
            .expect(201);

        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .send({memberId: member.body.id})
            .set('Cookie', cookie)
            .expect(201);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .set('Cookie', cookie)
            .expect(200);

        expect(res.body).toEqual([{memberId: member.body.id}]);
    });

    test('PUT /tastings/:id/hosts replaces all hosts', async () => {
        const tasting = await request(app)
            .post('/api/v1/tastings')
            .send({title: 'Test tasting', notes: '', tastingDate: '2024-01-15'})
            .set('Cookie', cookie)
            .expect(201);

        const member1 = await request(app)
            .post('/api/v1/members')
            .send({given: 'Test', surname: 'Testsson'})
            .set('Cookie', cookie)
            .expect(201);

        const member2 = await request(app)
            .post('/api/v1/members')
            .send({given: 'Anna', surname: 'Andersson'})
            .set('Cookie', cookie)
            .expect(201);

        await request(app)
            .post(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .send({memberId: member1.body.id})
            .set('Cookie', cookie)
            .expect(201);

        await request(app)
            .put(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .send([{memberId: member2.body.id}])
            .set('Cookie', cookie)
            .expect(204);

        const res = await request(app)
            .get(`/api/v1/tastings/${tasting.body.id}/hosts`)
            .set('Cookie', cookie)
            .expect(200);

        expect(res.body).toEqual([{memberId: member2.body.id}]);
    });
});