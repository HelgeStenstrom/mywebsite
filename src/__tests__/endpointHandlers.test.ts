import {beforeEach, describe, expect, test} from "@jest/globals";
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

    test('dummy', async() => {

        const sut = new EndpointHandlers(orm);

        const rs = undefined;
        // rs ska vara en ett objekt som har en funktion .status(int)
        // status(int) ska returnera ett objekt som har funktionen json(string)
        // Lämpligt att mocka dessa, och testa de argument som funktionerna får.

        const postMember: (req, res) => void = sut.postMember();
        const rq = {body: {Förnamn: "Nomen", Efternamn: "Nescio"}}
        postMember(rq, rs);

        const members = sut.getMembers();
        const promise = members({}, undefined);
        promise.then(value => expect(value).toBeTruthy());

    });

});
