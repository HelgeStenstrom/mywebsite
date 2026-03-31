// src/middleware/requireAuth.test.ts
import {requireAuth} from "./requireAuth";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = 'dev-secret';

function makeReq(token?: string): Partial<Request> {
    return {
        cookies: token ? {token} : {}
    };
}

function makeRes(): Partial<Response> {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe('RequireAuth middleware', () => {

    test('calls next() with valid token', () => {
        const token = jwt.sign({id: 1, email: 'helge@example.com', memberId: null}, JWT_SECRET);
        const req = makeReq(token);
        const res = makeRes();
        const next = jest.fn();

        requireAuth(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('returns 401 without token', () => {
        const req = makeReq();
        const res = makeRes();
        const next = jest.fn();

        requireAuth(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({status: 401, message: 'Not logged in'});
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 with invalid token', () => {
        const req = makeReq('invalid-token');
        const res = makeRes();
        const next = jest.fn();

        requireAuth(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({status: 401, message: 'Invalid token'});
        expect(next).not.toHaveBeenCalled();
    });

    test('sets req.user with correct payload', () => {
        const token = jwt.sign({id: 1, email: 'helge@example.com', memberId: 3}, JWT_SECRET);
        const req = makeReq(token) as Request;
        const res = makeRes();
        const next = jest.fn();

        requireAuth(req as Request, res as Response, next);

        expect((req as any).user).toEqual(expect.objectContaining({
            id: 1,
            email: 'helge@example.com',
            memberId: 3,
        }));
    });
})

