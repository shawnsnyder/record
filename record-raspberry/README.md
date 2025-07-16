# record-raspberry

A simple Node.js server for Raspberry Pi that exposes an HTTP endpoint to take a picture using a connected camera and returns the image.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```

2. Make sure your camera is connected and enabled (for Pi Camera, run `sudo raspi-config` to enable camera interface).

3. Start the server:
   ```sh
   npm start
   ```

## Usage

- The server runs on port 3001 by default.
- To take a picture and get the image, send a GET request to:
  
  `http://<raspberry-pi-ip>:3001/take-picture`

- The response will be a JPEG image.

## Notes
- This uses the `node-webcam` package, which supports both Pi Camera and USB webcams.
- For production, consider adding authentication or access control. 