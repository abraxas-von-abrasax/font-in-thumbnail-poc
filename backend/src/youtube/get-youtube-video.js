const { google } = require('googleapis');
const config = require('../utils/config');

const youtube = google.youtube('v3');

async function getYoutubeVideo(url) {
    const splitUrl = url.replace(/([><])/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    if (splitUrl[2] !== undefined) {
        const urlParts = splitUrl[2].split(/[^0-9a-z_\-]/i);
        const videoId = urlParts[0];

        const body = await youtube.videos.list({
            auth: config.google.apiKey,
            id: videoId,
            part: 'snippet'
        });

        if (body && body.data && body.data.items && body.data.items[0] && body.data.items[0].snippet) {
            return body.data.items[0].snippet;
        }
    }

    return null;
}

module.exports = getYoutubeVideo;
