import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const COOKIE_NAME = 'token';

export function devAutoLoginMiddleware(userId: number) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.cookies?.[COOKIE_NAME]) {
            const token = jwt.sign(
                {id: userId, email: 'dev@example.com', memberId: null},
                JWT_SECRET
            );
            res.cookie(COOKIE_NAME, token, {httpOnly: true, sameSite: 'lax'});
            req.cookies[COOKIE_NAME] = token;
        }
        next();
    };
}