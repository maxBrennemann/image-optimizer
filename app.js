const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const imageManager = require("./image-manipulation/sharp-manager");

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
app.use(fileUpload());

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.post('/api/v1/resize-image', (req, res, next) => {
    if (!req.files.image) {
        const err = new Error('Required query param image is missing');
        err.status = 400;
        next(err);
        return;
    }
    
    const image = req.files.image;

    if (!getFileExtension(image.name)) {
        const err = new Error('Invalid image file');
        err.status = 400;
        next(err);
        return;
    }

    

    let width = 1000;
    let height = 1000;

    if (req.query.width) {
        width = req.query.width;
    }
    if (req.query.height) {
        height = req.query.height;
    }

    return imageManager.resizeImage(image.data, width, height);
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

function getFileExtension (filename) {
    const allowedFileExt = ['JPEG', 'JPG', 'PNG', 'GIF', 'TIFF', 'PSD', 'PDF']; // you can add as per your requirement
    const fileExt = /[^.]+$/.exec(filename);
    return allowedFileExt.includes(fileExt[0].toUpperCase());
}
