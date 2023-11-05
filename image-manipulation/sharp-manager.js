const sharp = require('sharp');

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

const convertImage = async (image, format) => {
    return await sharp(image)
        .toFormat(format)
        .toBuffer();
}

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

const overlaySVG = async (image, svg, title = "", description = "", keywords = "") => {
    return await sharp(image)
        .composite([{
            input: svg,
            blend: 'over'
        }])
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

const combineOperations = async (image, operations) => {
    let sharpImage = sharp(image);
    operations.forEach(operation => {
        sharpImage = sharpImage[operation.name](operation.options);
    });
    return await sharpImage.toBuffer();
}

module.exports = {
    resizeImage,
    convertImage,
    makeImageSquare,
    overlaySVG,
    combineOperations
};
