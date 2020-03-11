function prepareImage(imageData) {
    return imageData.replace('data:image/jpeg;base64,', '');
}

module.exports = { prepareImage };
