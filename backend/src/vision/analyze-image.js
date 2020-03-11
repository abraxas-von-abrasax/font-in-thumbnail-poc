function getImageRequestObject(image, isUrl) {
    if (!isUrl) {
        return {
            content: Buffer.from(image, 'base64')
        };
    }
    return {
        source: {
            imageUri: image
        }
    };
}


async function analyzeImage(image, isUrl = false) {
    const imageRequestObject = getImageRequestObject(image, isUrl);
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.annotateImage({
        features: [
            {
                "maxResults": 50,
                "type": "DOCUMENT_TEXT_DETECTION"
            },
            {
                "maxResults": 50,
                "type": "IMAGE_PROPERTIES"
            },
            {
                "maxResults": 50,
                "type": "CROP_HINTS"
            }
        ],
        image: imageRequestObject
    });
    return {
        textAnnotations: result.textAnnotations,
        fullTextAnnotation: result.fullTextAnnotation,
        cropHints: (result.cropHintsAnnotation && result.cropHintsAnnotation.cropHints) || null,
        dominantColors: (result.imagePropertiesAnnotation && result.imagePropertiesAnnotation.dominantColors) || null
    }
}

module.exports = analyzeImage;
