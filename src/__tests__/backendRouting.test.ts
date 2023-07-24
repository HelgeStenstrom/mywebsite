import { app, setupEndpoints } from "../backendRouting";

describe('from setupEndpoints', () => {
    test('postCountry', () => {

        const router = {
            post: () => console.log('POST was called'),
            get: () => console.log('GET was called'),
            patch: () => console.log('PATCH was called'),
            delete: () => console.log('DELETE was called'),
        };
        setupEndpoints(router, {dialect: "sqlite",});
    });
});
