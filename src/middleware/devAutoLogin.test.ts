import {devAutoLoginMiddleware} from "./devAutoLogin";
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
    res.cookie = jest.fn().mockReturnValue(res);
    return res;
}

describe("devAutoLoginMiddleware", () => {

    test('sets cookie when no token exists', () => {
        const req = makeReq();
        const res = makeRes();
        const next = jest.fn();

        devAutoLoginMiddleware(1)(req as Request, res as Response, next);

        expect(res.cookie).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    test('does not set cookie when token already exists', () => {
        const existingToken = jwt.sign({id: 1, email: 'test@example.com', memberId: null}, JWT_SECRET);
        const req = makeReq(existingToken);
        const res = makeRes();
        const next = jest.fn();

        devAutoLoginMiddleware(1)(req as Request, res as Response, next);

        expect(res.cookie).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    test('cookie contains valid JWT with correct userId', () => {
        const req = makeReq();
        const res = makeRes();
        const next = jest.fn();

        devAutoLoginMiddleware(1)(req as Request, res as Response, next);

        const cookieCall = (res.cookie as jest.Mock).mock.calls[0];
        const token = cookieCall[1];
        const payload = jwt.verify(token, JWT_SECRET) as {id: number};
        expect(payload.id).toBe(1);
    });



})
