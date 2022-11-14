const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/jokes/random', (req, res) => {
    request(
        { url: 'https://joke-api-strict-cors.appspot.com/jokes/random' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: err.message });
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
                return res.status(500).json({ type: 'error', message: err.message });
            }

            res.json(JSON.parse(body));
        }
    )
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));