import express, {Express} from "express";
import {Options} from "sequelize";
import {Orm} from "./orm";
import {setupEndpoints} from "./backendRouting";
import cookieParser from "cookie-parser";

export async function createTestApp(): Promise<Express> {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    const sequelizeDbOptions: Options = {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    };

    const orm = new Orm('test', 'test', 'test', sequelizeDbOptions);

    await orm.sync();

    setupEndpoints(app, orm);

    return app;
}
