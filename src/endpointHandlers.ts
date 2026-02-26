/**
 * This class contains all the endpoint handlers. The endpoint handlers are called when the corresponding
 * endpoint is called. An endpoint is a URL, e.g. http://localhost:3000/grapes,
 * with an http method, e.g. GET, POST, etc.
 */
export class EndpointHandlers {


// Common utilities

    /**
     * This function takes a promise and returns a JSON response. If the promise fails, an error message is returned.
     * @param promise
     * @param res
     */
    thenJson<T>(promise: Promise<T>, res): Promise<void> {

        return promise
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => {
                console.error('Got error', err);
                res.status(503)
                    .send("Ingen kontakt med databasen. Är Docker startad?");
            });
    }



}
