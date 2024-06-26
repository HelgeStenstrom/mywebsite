import express from "express";
import axios from "axios";
import cors from "cors";

function getConfiguredApp() {
    const app = express();
    app.use(cors());

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });

    return app;
}

const app = getConfiguredApp();

// Test this: http://helges-mbp-2:3001/featured
app.get('/featured', (req, res) => {
    const zeroPad = (num, places) => String(num).padStart(places, '0')
    function makeUrl() {
        const now = Date.now();
        const today = new Date(now);
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const url = `https://sv.wikipedia.org/api/rest_v1/feed/featured/${year}/${zeroPad(month, 2)}/${zeroPad(date, 2)}`;
        console.log("EP: Idag är det ", today);
        console.log("EP YMD: ", year, month, date);
        return url;
    }

    const url1 = makeUrl();
    console.log("External proxy skickar vidare: ", url1);

    axios.get(url1)
        .then(response => res.json(response.data))
        .catch(err => console.log("An error with Axios", err));
});


// Test this: http://helges-mbp-2:3001/vinmonopolet
app.get('/vinmonopolet', (req, res) => {
    const headers = {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': '1ff26063efff409eb6200d72ac584c04',
    };
    const url1 = 'https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=10';

    const reqInstance = axios.create({headers});

    reqInstance.get(url1)
        .then(response => res.json(response.data))
        .catch(err => console.log("An error with Axios", err));

})


const PORT = process.env.PORT || "3001";

// TODO: Ta hostname från en konfigurationsfil. Om sajten används på localhost, behövs inte hostname.
//  0.0.0.0 lyssnar på alla adresser, vilket verkar onödigt.
app.listen(+PORT, '0.0.0.0',  () => console.log(`listening on ${PORT}`));
