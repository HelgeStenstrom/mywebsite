import express from "express";


export function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {

    const tokens = req.cookies;

    if (!tokens.token) {
        res.status(401);
        return;
    }

    const token = tokens.token;
    if (token == 'invalid-token') {
        res.status(401);
        return;
    }

    (req as any).user = {
        email: "helge@example.com",
        id:1,
        memberId:3
    }
    next();


}