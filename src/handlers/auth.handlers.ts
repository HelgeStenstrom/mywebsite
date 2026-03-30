import {Orm} from "../orm";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const COOKIE_NAME = 'token';

export class AuthHandlers {
    constructor(private readonly orm: Orm) {}

    login() {
        return async (req: Request, res: Response) => {
            const {email, password} = req.body;
            const user = await this.orm.users.findByEmail(email);
            if (!user) {
                return res.status(401).json({status: 401, message: 'Invalid credentials'});
            }
            const valid = await bcrypt.compare(password, user.passwordHash);
            if (!valid) {
                return res.status(401).json({status: 401, message: 'Invalid credentials'});
            }
            const token = jwt.sign(
                {id: user.id, email: user.email, memberId: user.memberId},
                JWT_SECRET,
                {expiresIn: '7d'}
            );
            res.cookie(COOKIE_NAME, token, {httpOnly: true, sameSite: 'strict'});
            return res.status(200).json({id: user.id, email: user.email, memberId: user.memberId});
        };
    }

    logout() {
        return (_req: Request, res: Response) => {
            res.clearCookie(COOKIE_NAME);
            return res.status(204).send();
        };
    }

    me() {
        return (req: Request, res: Response) => {
            const token = req.cookies?.[COOKIE_NAME];
            if (!token) {
                return res.status(401).json({status: 401, message: 'Not logged in'});
            }
            try {
                const payload = jwt.verify(token, JWT_SECRET) as {id: number, email: string, memberId: number | null};
                return res.status(200).json({id: payload.id, email: payload.email, memberId: payload.memberId});
            } catch {
                return res.status(401).json({status: 401, message: 'Invalid token'});
            }
        };
    }

    register() {
        return async (req: Request, res: Response) => {
            const {email, password, memberId} = req.body;
            const user = await this.orm.users.create({email, password, memberId: memberId ?? null});
            return res.status(201).json({id: user.id, email: user.email, memberId: user.memberId});
        };
    }
}