require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestLogger = require('./src/utils/request-logger');
const { prepareImage } = require('./src/vision/prepare-image');
const analyzeImage = require('./src/vision/analyze-image');
const getYoutubeVideo = require('./src/youtube/get-youtube-video');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(requestLogger);

app.get('/api/url/:url', async (request, response) => {
    if (!request.params.url) {
        return response.status(400).send('Error: malformed URL');
    }

    const youtubeVideo = await getYoutubeVideo(request.params.url);

    if (!youtubeVideo) {
        return response.status(404).send(`Cannot find YouTube video for URL ${request.params.url}`);
    }

    const result = await analyzeImage(youtubeVideo['thumbnails'].default.url, true);
    result.imageUrl = youtubeVideo['thumbnails'].default.url;
    return response.status(200).send(result);
});

app.post('/api', async (request, response) => {
    if (!request.body.image) {
        return response.status(400).send('Error: No image provided.');
    }
    const imageData = decodeURIComponent(request.body.image);
    const result = await analyzeImage(prepareImage(imageData));
    return response.status(200).send(result);
});

app.listen(3005, () => console.log('Font in Thumbnail PoC Backend listening on port 3005'));
