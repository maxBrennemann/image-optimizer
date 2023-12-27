const sharp = require('sharp');

/**
 * resizes an image to the given width and height;
 * @param {*} image 
 * @param {*} width 
 * @param {*} height 
 * @returns 
 */
const resizeImage = async (image, width, height) => {
    const imageData = await sharp(image);
    const metadata = await imageData.metadata();

    if (!width) {
        width = metadata.width;
    }

    if (!height) {
        height = metadata.height;
    }
    
    if (width == metadata.width && height == metadata.height) {
        return image;
    }

    return await sharp(image)
        .resize(width, height)
        .toFile("./converted/" + width + "x" + height + ".jpg");
}

/**
 * converts an image to a different format
 * @param {*} image 
 * @param {*} format 
 * @returns 
 */
const convertImage = async (image, format, name) => {
    switch (format) {
        case "avif":
            sharp(image)
                .avif({
                    effort: 2,
                    quality: 100,
                    lossless: true,
                })
                .toFile("./converted/" + name + ".avif");
            break;
        case "webp":
            sharp(image)
                .webp({
                    effort: 2,
                    quality: 100,
                    lossless: true,
                })
                .toFile("./converted/" + name + ".webp");
            break;
        case "png":
            sharp(image)
                .png({
                    quality: 80
                })
                .toFile("./converted/" + name + ".png");
            break;
        default:
            sharp(image)
                .jpeg({
                    quality: 80
                })
                .toFile("./converted/" + name + ".jpg");
            break;
    }
}

/**
 * saves an image as a square;
 * if the image is already squared, it will be returned;
 * the new width and height will be 1000px
 * @param {*} image 
 * @param {*} name 
 * @returns 
 */
const makeImageSquare = async (image, name) => {
    return await sharp(image)
        .resize(1000, 1000, {
            fit: "contain",
            background: {
                r: 255,
                g: 255,
                b: 255,
                alpha: 1
            },
        })
        .toFile("./converted/" + name + "_squared.jpg");
}

const overlaySVG = async (image, svg, title = "", description = "", keywords = "", x, y, widthSvg, heightSvg, rotate, width, height) => {
    return await sharp(image)
        .composite([{
            input: svg,
            blend: 'over',
            top: y,
            left: x,
            width: widthSvg,
            height: heightSvg,
        }])
        .resize(width, height)
        .withMetadata({
            icc: true,
            xmp: true,
            exif: {
              IFDO: {
                Artist: previousMetadata.exif.IFD0.Artist,
                Author: previousMetadata.exif.IFD0.Author,
                Creator: previousMetadata.exif.IFD0.Creator + " edited by klebefux", 
                Title: title,
                Description: description,
                Keywords: keywords,
              }
            }
          })
        .toBuffer();
}

/**
 * combines multiple operations to one image
 * @param {*} image 
 * @param {*} operations 
 * @returns 
 */
const combineOperations = async (image, svg, title) => {
    return await sharp(image)
        .composite([{
            input: svg,
            blend: 'over',
            top: 0,
            left: 0,
            width: 1000,
            height: 1000,
        }])
        .resize(1000, 1000)
        //.toBuffer()
        .toFile("./overlayed/" + title + ".jpg");
}

module.exports = {
    resizeImage,
    convertImage,
    makeImageSquare,
    overlaySVG,
    combineOperations
};
