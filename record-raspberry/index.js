const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
app.use(cors());
const port = 3001;

const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR);
}

const LATEST_IMAGE = path.join(IMAGES_DIR, 'latest.jpg');

app.get('/take-picture', (req, res) => {
    // Always save as latest.jpg
    exec(`libcamera-jpeg -o ${LATEST_IMAGE} --width 1280 --height 720`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error taking picture:', stderr);
            return res.status(500).json({ error: 'Failed to take picture' });
        }
        res.sendFile(LATEST_IMAGE);
    });
});

app.listen(port, () => {
    console.log(`Camera server listening at http://localhost:${port}`);
}); 