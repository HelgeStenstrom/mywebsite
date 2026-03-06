import {afterEach, beforeEach, describe, expect, jest, test} from "@jest/globals";
import {Orm} from "../orm";
import {MemberHandlers} from "../handlers/member.handlers";

const longTime = 500; // TODO: make the test run faster, without the need for timeouts.

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


    test('get members before there are any, with timeout', (done) => {
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
            foo: "bar",
        };

        const sut = new MemberHandlers(orm);
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

        const sut = new MemberHandlers(orm);

        const postPromise = sut.postMember()(req2, res);

        setTimeout(() => {
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            done();
        }, longTime);

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

        const sut = new MemberHandlers(orm);
        const memberHandlingFunction: (req, res) => Promise<void> = sut.postMember();
        const promise1 = memberHandlingFunction(req, res);
        setTimeout(() => {
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);

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

        const sut = new MemberHandlers(orm);
        const memberHandlingFunction: (req, res) => Promise<void> = sut.postMember();
        const promise = memberHandlingFunction(req, res);

        jest.runAllTimers();

        return promise.then(() => {

            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

    });

});

