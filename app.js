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

app.post('/api/v1/resize-image', async (req, res, next) => {
    if (!req.files.image) {
        const err = new Error('Required query param image is missing');
        err.status = 400;
        next(err);
        return;
    }
    
    const image = req.files.image;
    if (!validateImage(image)) {
        const err = new Error('Invalid image file');
        err.status = 400;
        next(err);
    }

    let width = 1000;
    let height = 1000;

    if (req.query.width) {
        width = req.query.width;
    }
    if (req.query.height) {
        height = req.query.height;
    }

    image.mv('./upload/' + image.name, async function() {
        const resultimage = await imageManager.resizeImage('./upload/' + image.name, width, height);
        res.send({
            image: "saved",
        });
    });
});

/**
 * converts an image to a different format
 */
app.post('/api/v1/convert-image', (req, res, next) => {
    if (!req.files.image) {
        const err = new Error('Required query param image is missing');
        err.status = 400;
        next(err);
    }

    let format = "avif";
    
    if (req.query.format) {
        format = req.query.format;
    }

    const image = req.files.image;
    if (!validateImage(image)) {
        const err = new Error('Invalid image file');
        err.status = 400;
        next(err);
    }

    image.mv('./upload/' + image.name, async function() {
        await imageManager.resizeImage('./upload/' + image.name, format, image.name);
        res.send({
            image: "saved",
        });
    });
});

/**
 * makes an image square by adding white background
 */
app.post('/api/v1/make-image-square', async (req, res, next) => {
    if (!req.files.image) {
        const err = new Error('Required query param image is missing');
        err.status = 400;
        next(err);
        return;
    }
    
    const image = req.files.image;
    if (!validateImage(image)) {
        const err = new Error('Invalid image file');
        err.status = 400;
        next(err);
    }

    let width = 1000;
    let height = 1000;

    image.mv('./upload/' + image.name, async function() {
        const resultimage = await imageManager.makeImageSquare('./upload/' + image.name, image.name);
        res.send({
            image: "saved",
        });
    });
});

/**
 * overlays an svg on top of an image;
 * by using the x and y coordinates, the svg can be moved around
 */
app.post('/api/v1/overlay-svg', (req, res, next) => {
    if (!req.query.image || !req.query.svg) {
        const err = new Error('Required query params are missing');
        err.status = 400;
        next(err);
    }

    const image = req.query.image;
    if (!validateImage(image)) {
        const err = new Error('Invalid image file');
        err.status = 400;
        next(err);
    }

    const svg = req.query.svg;
    if (!validateImage(svg)) {
        const err = new Error('Invalid image file');
        err.status = 400;
        next(err);
    }

    const title = req.query.title ? req.query.title : "";
    const description = req.query.description ? req.query.description : "";
    const keywords = req.query.keywords ? req.query.keywords : "";

    const x = req.query.x ? req.query.x : 0;
    const y = req.query.y ? req.query.y : 0;

    const widthSvg = req.query.widthSvg ? req.query.widthSvg : 1000;
    const heightSvg = req.query.heightSvg ? req.query.heightSvg : 1000;
    const rotate = req.query.rotate ? req.query.rotate : 0;

    const width = req.query.width ? req.query.width : 1000;
    const height = req.query.height ? req.query.height : 1000;

    image.mv('./upload/' + image.name, async function() {
        svg.mv('./upload/' + svg.name, async function() {
            const resultimage = await imageManager.overlaySVG('./upload/' + image.name, './upload/' + svg.name, title, description, keywords, x, y, widthSvg, heightSvg, rotate, width, height);
            res.send({
                image: "saved",
            });
        });
    });
});

/**
 * makes the image square and puts the svg on top of it
 */
app.post('/api/v1/combine-operations', (req, res, next) => {
    if (!req.files.image || !req.query.width || !req.query.format || !req.files.svg) {
        const err = new Error('Required query params are missing');
        err.status = 400;
        next(err);
    }
    
    const image = req.files.image;
    const svg = req.files.svg;
    const width = req.body.width;
    const format = req.body.format;

    if (!validateImage(image)) {
        const err = new Error('Invalid image file');
        err.status = 400;
        next(err);
    }

    if (!validateImage(svg)) {
        const err = new Error('Invalid image file');
        err.status = 400;
        next(err);
    }

    image.mv('./upload/' + image.name, async function() {
        svg.mv('./upload/' + svg.name, async function() {
            const resultimage = await imageManager.combineOperations('./upload/' + image.name, './upload/' + svg.name);
            res.send({
                image: "saved",
            });
        });
    });
});

/**
 * returns false if file is not allowed
 * @param {*} image 
 * @returns 
 */
function validateImage(image) {
    if (!getFileExtension(image.name)) {
        return false;
    }

    if (!checkMimeType(image.mimetype)) {
        return false;
    }

    return true;
}

function checkMimeType (mimetype) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/psd', 'application/pdf'];
    return allowedMimeTypes.includes(mimetype);
}

function getFileExtension (filename) {
    const allowedFileExt = ['JPEG', 'JPG', 'PNG', 'GIF', 'TIFF', 'PSD', 'PDF'];
    const fileExt = /[^.]+$/.exec(filename);
    return allowedFileExt.includes(fileExt[0].toUpperCase());
}
