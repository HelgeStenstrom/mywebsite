import request from "request";
import express from "express";
import cors from "cors";


// Code from https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
// which uses deprecated 'request'.

// TODO: replace request, see https://nodesource.com/blog/express-going-into-maintenance-mode

const app = express();
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/jokes/random', (req, res) => {
    request(
        { url: 'https://joke-api-strict-cors.appspot.com/jokes/random' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error.message });
            }

            res.json(JSON.parse(body));
        }
    )
});

app.get('/featured', (req, res) => {
    function makeUrl() {
        const now = Date.now();
        const today = new Date(now);
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const url = `https://sv.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${date}`;
        console.log("EP: Idag är det ", today);
        console.log("EP YMD: ", year, month, date);
        return url;
    }

    const url1 = makeUrl();
    console.log("External proxy skickar vidare: ", url1);
    request(
        { url: url1 },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error.message });
            }

            res.json(JSON.parse(body));
        }
    )
});


app.get('/vinmonopolet', (req, res) => {

    const headers = {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': '1ff26063efff409eb6200d72ac584c04',
    };

    const url1  = 'https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=10';
    //const url1  = `https://sv.wikipedia.org/api/rest_v1/feed/featured/${2022}/${11}/${14}`;
    console.log("External proxy skickar vidare: ", url1);
    request(
        {url: url1,
            headers: headers},
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                console.log("Error: ", error);
                console.log("Response: ", response);
                //console.log("Status code: ", response.statusCode);
                //return res.status(500).json({ type: 'error', message: err.message });
                return res.status(500).json({ type: 'error', message: "err.message is 'it went wrong'" });
            }
            res.json(JSON.parse(body));
        }
    )
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));