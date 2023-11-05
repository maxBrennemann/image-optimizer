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
        .toBuffer();
}

const convertImage = async (image, format) => {
    return await sharp(image)
        .toFormat(format)
        .toBuffer();
}

const makeImageSquare = async (image) => {
    return await sharp(image)
        .resize({
            fit: sharp.fit.inside,
            width: 1000,
            height: 1000
        })
        .toBuffer();
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
