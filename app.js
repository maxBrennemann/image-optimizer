const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();
/**
 * solve cors error: https://maximillianxavier.medium.com/solving-cors-problem-on-local-development-with-docker-4d4a25cd8cfe
 */
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));
app.use(express.json());

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.post('/api/v1/resize-image', (req, res) => {
    if (!req.query.image) {
        const err = new Error('Required query param image is missing');
        err.status = 400;
        next(err);
    }
    
    const image = req.body.image;

    let width = 1000;
    let height = 1000;

    if (req.query.width) {
        width = req.query.width;
    }
    if (req.query.height) {
        height = req.query.height;
    }
});

app.post('/api/v1/convert-image', (req, res) => {
    if (!req.query.image) {
        const err = new Error('Required query param image is missing');
        err.status = 400;
        next(err);
    }
    
    const image = req.body.image;

    let format = "avif";
    
    if (req.query.format) {
        format = req.query.format;
    }
});

app.post('/api/v1/make-image-square', (req, res) => {
    if (!req.query.image) {
        const err = new Error('Required query param image is missing');
        err.status = 400;
        next(err);
    }
    
    const image = req.body.image;
});

app.post('/api/v1/overlay-svg', (req, res) => {
    if (!req.query.image || !req.query.svg) {
        const err = new Error('Required query params are missing');
        err.status = 400;
        next(err);
    }
    
    const image = req.body.image;
    const svg = req.body.svg;
});

app.post('/api/v1/combine-operations', (req, res) => {
    if (!req.query.image || !req.query.width || !req.query.format) {
        const err = new Error('Required query params are missing');
        err.status = 400;
        next(err);
    }
    
    const image = req.body.image;
    const width = req.body.width;
    const format = req.body.format;
});
