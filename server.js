const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    const isAudio = req.query.quality === 'mp3';

    if (!videoURL) return res.status(400).send("URL required");

    try {
        // নতুন এপিআই (Cobalt) যা দিয়ে ভিডিও এবং অডিও ডাউনলোড করা যাবে
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: videoURL,
            isAudioOnly: isAudio,
            aFormat: isAudio ? 'mp3' : 'best',
            vQuality: '720' // 720p বা তার বেশি কোয়ালিটির জন্য
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.url) {
            // সরাসরি ডাউনলোড লিঙ্কে রিডাইরেক্ট করা
            res.redirect(response.data.url);
        } else {
            res.status(500).send("Error: API failed to provide a download link.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("The downloader API is currently busy. Please try again in 1 minute.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
