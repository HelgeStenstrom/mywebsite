const express = require("express");
const app = express()

app.get('/', (req, res, next) => {
    res
        //.status(404)
        .json({meddelande: "fel"})

    //    .send("Hej")
    ;
    //res.sendStatus(500);
    let seven = req.rawHeaders[7];
    console.log('Here  from ', seven);
});

app.listen(3000);
