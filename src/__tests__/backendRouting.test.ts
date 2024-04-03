import { setupEndpoints } from "../backendRouting";
import express, { Express, IRouterMatcher } from "express";

// TODO: Klargör syftet med denna fil, eller ta bort den. Se till att den uppfyller sitt syfte.

// Syfte: verifiera att http-anrop till endpoints returnerar förväntat data.

describe('from setupEndpoints', () => {
    test('postCountry', () => {

        const router = {
            post: () => console.log('POST was called'),
            get: () => console.log('GET was called'),
            patch: () => console.log('PATCH was called'),
            delete: () => console.log('DELETE was called'),
        } as any as Express;  // From https://stackoverflow.com/questions/57964299/mocking-express-request-with-jest-and-typescript-using-correct-types
        setupEndpoints(router, {dialect: "sqlite",});
    });
});

