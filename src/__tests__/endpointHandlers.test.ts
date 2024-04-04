import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Orm } from "../orm";
import { EndpointHandlers } from "../endpointHandlers";

const longTime = 1000;

describe('Endpoint handler tests', () => {

    let orm: Orm;

    beforeEach(async () => {
        orm = new Orm("myDatabase", "myUserName", "mySecret",
            {
                dialect: "sqlite",
            });
        await orm.createTables();
    });

    afterEach(() => {
        orm = null;
    });

    test.skip('get members before there are any', async () => {
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        const sut = new EndpointHandlers(orm);
        const memberHandlingFunction: (req, res) => Promise<void> = sut.getMembers();

        await memberHandlingFunction(null, res);
        expect(res.status).toHaveBeenCalled();
    });

    test.skip('get members before there are any, without async/await', (done) => {
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        //expect(res.status(12345)).toBe(res); // Checking that status is mocked correctly

        const sut = new EndpointHandlers(orm);
        const memberHandlingFunction: (req, res) => Promise<void> = sut.getMembers();


        return expect(memberHandlingFunction(null, res)).resolves.toBeUndefined().then(() => {
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(12);
            done();
        });

    });


    test('get members before there are any, with timeout', (done) => {
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
            foo: "bar",
        };

        //expect(res.status(12345)).toBe(res); // Checking that status is mocked correctly

        const sut = new EndpointHandlers(orm);
        const memberHandlingFunction: (req, res) => Promise<void> = sut.getMembers();
        const promise = memberHandlingFunction(null, res);

        setTimeout(() => {
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);

            promise.then(() => {
                expect(res.status).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(200);
                done();
            }).catch((error) => {
                // If the promise rejects, you can handle errors here.
                // Call `done` with an error to fail the test in case of errors.

                expect(res.status).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(202);
                done(error);
            });

        }, longTime);


    })


    test('get members after one post, with timeout', (done) => {
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
            foo: "bar",
        };

        const req1 = {body: {id: 17, givenName: "Nomen", surname: "Nescio"}};
        const req2 = {body: {Given: "Nomen", Efternamn: "Nescio"}};

        //expect(res.status(12345)).toBe(res); // Checking that status is mocked correctly

        const sut = new EndpointHandlers(orm);

        const postPromise = sut.postMember()(req2, res);

        setTimeout(() => {
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            done();
        }, longTime);

    });

    test.skip('post and read back members', async () => {
        // TODO: När detta test körs, blir det inte färdigt, och följande test(er) tycks misslyckas.
        //  Test runner säger "Terminated". Undersök loggen från testkörningen.

        const sut = new EndpointHandlers(orm);

        const rs = jest.fn(x => {
            // Nothing defined, not needed?
            //status: (n) => console.log('.status called with ', n);
        });
        // rs ska vara en ett objekt som har en funktion .status(int)
        // status(int) ska returnera ett objekt som har funktionen json(string)
        // Lämpligt att mocka dessa, och testa de argument som funktionerna får.

        const postMember: (req, res) => void = sut.postMember();
        const rq = {body: {Given: "Nomen", Efternamn: "Nescio"}};
        //const rq = {Given: "Nomen", Efternamn: "Nescio"};
        postMember(rq, rs);

        const members: (req, res) => Promise<void> = sut.getMembers();
        // TODO: Förstå argumenten till members()
        const promise = members({}, {status: (n) => console.log('.status called with ', n)});
        promise.then(value => {
            expect(value).toBeTruthy();
        });

    });

    /**
     * From ChatGPT: https://chat.openai.com/c/4bb0536d-9f8f-4b6b-9c72-519cb8702770
     **/
    test('it should return status 201 with a success message, using timeout', done => {

        // TODO: Make this test take shorter time.
        //  It should only take a couple of ms when it passes, not the full timeout duration.
        const req = {body: {Given: "Nomen", Efternamn: "Nescio"}};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        const sut = new EndpointHandlers(orm);
        const memberHandlingFunction: (req, res) => Promise<void> = sut.postMember();
        const promise1 = memberHandlingFunction(req, res);
        setTimeout(() => {
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201); // FAIL med flit, just nu.
            expect(res.json).toHaveBeenCalledWith("postMember called!");

            promise1.then(() => {
                done();
            });

        }, longTime);


    });


    test('it should return status 201 with a success message, using Jest faketimers', () => {

        jest.useFakeTimers();
        const req = {body: {Given: "Nomen", Efternamn: "Nescio"}};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        const sut = new EndpointHandlers(orm);
        const memberHandlingFunction: (req, res) => Promise<void> = sut.postMember();
        const promise = memberHandlingFunction(req, res);

        jest.runAllTimers();

        return promise.then(() => {

            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201); // FAIL med flit, just nu.
            expect(res.json).toHaveBeenCalledWith("postMember called!");
        });

    });

    test.skip('post and read back countries', async () => {

        throw Error('Not ready, fix test of members first!')

        const sut = new EndpointHandlers(orm);

        const rs = jest.fn(x => {
            // Nothing defined, not needed?
        });
        // rs ska vara en ett objekt som har en funktion .status(int)
        // status(int) ska returnera ett objekt som har funktionen json(string)
        // Lämpligt att mocka dessa, och testa de argument som funktionerna får.

        const postCountry: (req, res) => void = sut.postCountry();
        const rq = "Tyskland"
        postCountry(rq, rs);

        const countries = sut.getCountries();
        const promise = countries({}, undefined);
        promise.then(value => {
            //expect(value).toBeTruthy();
        });

    });

});


describe('thenJson test happy path', () => {

    test('thenJson happy path using async', async () => {

        const sut = new EndpointHandlers(undefined);

        const promisedValue = [123];
        const promise: Promise<any[]> = Promise.resolve(promisedValue);
        let status: number;
        let jsonCalled = false;
        let jsonCalledWith;
        const res = {
            json: (x) => {
                jsonCalled = true;
                jsonCalledWith = x;
                return "a string";
            },
            status: (n: number) => {
                status = n;
                return res;
            },
        };

        await sut.thenJson(promise, res);

        expect(status).toEqual(200);
        expect(jsonCalled).toBeTruthy();
        expect(jsonCalledWith).toEqual(promisedValue);
    });

    test('thenJson happy path with then', () => {

        const sut = new EndpointHandlers(undefined);

        const promisedValue = [123];
        const promise: Promise<any[]> = Promise.resolve(promisedValue);
        let status: number;
        let jsonCalled = false;
        let jsonCalledWith;
        const res = {
            json: (x) => {
                jsonCalled = true;
                jsonCalledWith = x;
                return "a string";
            },
            status: (n: number) => {
                status = n;
                return res;
            },
        };

        sut.thenJson(promise, res)
            .then(() => {
                expect(status).toEqual(200);
                expect(jsonCalled).toBeTruthy();
                expect(jsonCalledWith).toEqual(promisedValue);
                //console.log("done!");
            });


    });
});

describe('thenJson unhappy path', () => {

    const dockerStartad = "Ingen kontakt med databasen. Är Docker startad?";

    let status: number;

    let sendCalled = false;
    let sendCalledWith;
    const res = {
        send: (x) => {
            sendCalled = true;
            sendCalledWith = x;
            return "a string";
        },
        status: (n: number) => {
            status = n;
            return res;
        },
    };

    test('thenJson unhappy path async', async () => {
        const sut = new EndpointHandlers(undefined);

        const prom: Promise<any[]> = Promise.reject();

        await sut.thenJson(prom, res);

        expect(status).toEqual(503);
        expect(sendCalled).toBeTruthy();
        expect(sendCalledWith).toEqual(dockerStartad);
    });

    test('thenJson unhappy path with then', () => {
        const sut = new EndpointHandlers(undefined);

        const prom: Promise<never> = Promise.reject();


        sut.thenJson(prom, res)
            .then(() => {
                expect(status).toEqual(503);
                expect(sendCalled).toBeTruthy();
                expect(sendCalledWith).toEqual(dockerStartad);
            });

    });
});
