import express, {Express} from "express";
import {Options} from "sequelize";
import {Orm} from "./orm";
import {setupEndpoints} from "./backendRouting";
import cookieParser from "cookie-parser";
import request from "supertest";
import {randomUUID} from "node:crypto";

export async function createTestApp(): Promise<{ app: Express, orm: Orm }> {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    const sequelizeDbOptions: Options = {
        dialect: 'sqlite',
        //storage: ':memory:',
        storage: `/tmp/test-${randomUUID()}.sqlite`,
        logging: false
    };

    const orm = new Orm('test', 'test', 'test', sequelizeDbOptions);

    await orm.sync();

    setupEndpoints(app, orm);

    return { app, orm };
}

export async function loginAs(app: Express, email: string, password: string): Promise<string> {
    await request(app).post('/api/v1/auth/register').send({email, password, memberId: null});
    const response = await request(app).post('/api/v1/auth/login').send({email, password});
    return response.headers['set-cookie'];
}