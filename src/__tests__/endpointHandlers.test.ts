import {beforeEach, describe, expect, test, jest} from "@jest/globals";
import {Orm} from "../orm";
import {EndpointHandlers} from "../endpointHandlers";


describe('Endpoint handler tests', () => {

    let orm: Orm;

    beforeEach(() => {
        orm = new Orm("myDatabase", "myUserName", "mySecret",
            {
                dialect: "sqlite",
            });
    });

    test('post and read back members', async() => {

        const sut = new EndpointHandlers(orm);

        const rs = jest.fn(x => {
            // Nothing defined, not needed?
        });
        // rs ska vara en ett objekt som har en funktion .status(int)
        // status(int) ska returnera ett objekt som har funktionen json(string)
        // Lämpligt att mocka dessa, och testa de argument som funktionerna får.

        const postMember: (req, res) => void = sut.postMember();
        const rq = {body: {Förnamn: "Nomen", Efternamn: "Nescio"}}
        postMember(rq, rs);

        const members = sut.getMembers();
        const promise = members({}, undefined);
        promise.then(value => {
            //expect(value).toBeTruthy();
        });

    });

});


describe('thenJson test happy path', () => {

    test('thenJson happy path using async', async() => {

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
