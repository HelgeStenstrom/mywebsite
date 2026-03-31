import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const COOKIE_NAME = 'token';

export function requireAuth(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
        res.status(401).json({status: 401, message: 'Not logged in'});
        return;
    }

    try {
        (req as any).user = jwt.verify(token, JWT_SECRET) as { id: number, email: string, memberId: number };
        next();
    } catch  {
        res.status(401).json({status: 401, message: 'Invalid token'});
    }
}