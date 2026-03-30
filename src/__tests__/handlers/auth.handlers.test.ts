import express from "express";
import {createTestApp} from "../../testUtils";
import request from "supertest";

describe('AuthHandlers', () => {

    let app: express.Express;

    beforeEach(async () => {
        app = await createTestApp();
    });

    test('POST /auth/login returns 200 and sets cookie with valid credentials', async () => {
        await request(app).post('/api/v1/auth/register').send({
            email: 'helge@example.com',
            password: 'secret',
            memberId: null,
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'helge@example.com', password: 'secret'});

        expect(response.status).toBe(200);
        expect(response.body.email).toBe('helge@example.com');
        expect(response.headers['set-cookie']).toBeDefined();
    });

    test('POST /auth/login returns 401 with invalid password', async () => {
        await request(app).post('/api/v1/auth/register').send({
            email: 'helge@example.com',
            password: 'secret',
            memberId: null,
        });

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'helge@example.com', password: 'wrongpassword'});

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
            email: 'helge@example.com',
            password: 'secret',
            memberId: null,
        });

        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'helge@example.com', password: 'secret'});

        const cookie = loginResponse.headers['set-cookie'];

        const meResponse = await request(app)
            .get('/api/v1/auth/me')
            .set('Cookie', cookie);

        expect(meResponse.status).toBe(200);
        expect(meResponse.body.email).toBe('helge@example.com');
    });

    test('GET /auth/me returns 401 without cookie', async () => {
        const response = await request(app).get('/api/v1/auth/me');
        expect(response.status).toBe(401);
    });

    test('POST /auth/logout returns 204 and clears cookie', async () => {
        await request(app).post('/api/v1/auth/register').send({
            email: 'helge@example.com',
            password: 'secret',
            memberId: null,
        });

        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({email: 'helge@example.com', password: 'secret'});

        const cookie = loginResponse.headers['set-cookie'];

        const logoutResponse = await request(app)
            .post('/api/v1/auth/logout')
            .set('Cookie', cookie);

        expect(logoutResponse.status).toBe(204);
    });
});