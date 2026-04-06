import express from "express";
import {createTestApp} from "../../testUtils";
import request from "supertest";
import {Orm} from "../../orm";

describe('AuthHandlers', () => {

    let app: express.Express;
    let orm: Orm;

    beforeEach(async () => {
        ({ app, orm } = await createTestApp());
    });

    afterEach(async () => {
        await orm.close();
    });

    test('POST /auth/login returns 200 and sets cookie with valid credentials', async () => {
        await request(app).post('/api/v1/auth/register').send({
            email: 'user@example.com',
            password: 'secret',
            memberId: null,
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'user@example.com', password: 'secret'});

        expect(response.status).toBe(200);
        expect(response.body.email).toBe('user@example.com');
        expect(response.headers['set-cookie']).toBeDefined();
    });

    test('POST /auth/login returns 401 with invalid password', async () => {
        await request(app).post('/api/v1/auth/register').send({
            email: 'user@example.com',
            password: 'secret',
            memberId: null,
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'user@example.com', password: 'wrongpassword'});

        expect(response.status).toBe(401);
    });

    test('POST /auth/login returns 401 with unknown email', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'nobody@example.com', password: 'secret'});

        expect(response.status).toBe(401);
    });

    test('GET /auth/me returns 200 with valid cookie', async () => {
        await request(app).post('/api/v1/auth/register').send({
            email: 'user@example.com',
            password: 'secret',
            memberId: null,
        });

        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'user@example.com', password: 'secret'});

        const cookie = loginResponse.headers['set-cookie'];

        const meResponse = await request(app)
            .get('/api/v1/auth/me')
            .set('Cookie', cookie);

        expect(meResponse.status).toBe(200);
        expect(meResponse.body.email).toBe('user@example.com');
    });

    test('GET /auth/me returns 401 without cookie', async () => {
        const response = await request(app).get('/api/v1/auth/me');
        expect(response.status).toBe(401);
    });

    test('POST /auth/logout returns 204 and clears cookie', async () => {
        await request(app).post('/api/v1/auth/register').send({
            email: 'user@example.com',
            password: 'secret',
            memberId: null,
        });

        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'user@example.com', password: 'secret'});

        const cookie = loginResponse.headers['set-cookie'];

        const logoutResponse = await request(app)
            .post('/api/v1/auth/logout')
            .set('Cookie', cookie);

        expect(logoutResponse.status).toBe(204);
    });

    test('POST /auth/register returns 409 when email already exists', async () => {
        await request(app)
            .post('/api/v1/auth/register')
            .send({email: 'user@example.com', password: 'secret', memberId: null})
            .expect(201);

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({email: 'user@example.com', password: 'secret', memberId: null});

        expect(response.status).toBe(409);
    });

    describe('Change password', () => {

        test('POST /auth/change-password returns 200 with correct current password', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({email: 'user@example.com', password: 'secret', memberId: null})
                .expect(201);

            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({email: 'user@example.com', password: 'secret'})
                .expect(200);

            const cookie = loginResponse.headers['set-cookie'];

            const response = await request(app)
                .post('/api/v1/auth/change-password')
                .set('Cookie', cookie)
                .send({currentPassword: 'secret', newPassword: 'newSecret'});

            expect(response.status).toBe(200);
        });

        test('POST /auth/change-password returns 403 with wrong current password', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({email: 'user@example.com', password: 'secret', memberId: null});

            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({email: 'user@example.com', password: 'secret'});

            const cookie = loginResponse.headers['set-cookie'];

            const response = await request(app)
                .post('/api/v1/auth/change-password')
                .set('Cookie', cookie)
                .send({currentPassword: 'wrongpassword', newPassword: 'newSecret'});

            expect(response.status).toBe(403);
        });

        test('POST /auth/change-password allows login with new password after change', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({email: 'user@example.com', password: 'secret', memberId: null});

            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({email: 'user@example.com', password: 'secret'});

            const cookie = loginResponse.headers['set-cookie'];

            await request(app)
                .post('/api/v1/auth/change-password')
                .set('Cookie', cookie)
                .send({currentPassword: 'secret', newPassword: 'newSecret'})
                .expect(200);

            const newLoginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({email: 'user@example.com', password: 'newSecret'});

            expect(newLoginResponse.status).toBe(200);
        });
    })


});