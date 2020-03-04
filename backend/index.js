const quickstart = require('./src/quickstart');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.post('/', async (request, response) => {
    if (!request.body.image) {
        return response.status(400).send('Error: No image provided.');
    }
    const image = decodeURIComponent(request.body.image);
    const result = await quickstart(image);
    return response.status(200).send(result);
});

app.listen(3005, () => console.log('Font in Thumbnail PoC Backend listening on port 3005'));
