const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    const type = req.query.quality === 'highestaudio' ? 'mp3' : 'mp4';

    if (!videoURL) return res.status(400).send("URL required");

    try {
        const apiRes = await axios.get(`https://api.vyt.workers.dev/api/download?url=${encodeURIComponent(videoURL)}&format=${type}`);
        if (apiRes.data && apiRes.data.url) {
            res.redirect(apiRes.data.url);
        } else {
            res.status(500).send("Error fetching link");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

