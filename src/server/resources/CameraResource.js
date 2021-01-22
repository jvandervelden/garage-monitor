const BaseResource = require('./BaseResource');
const camera = require('camera-js');

BASE_URL = '/v1/camera';

class CameraResource {

    constructor(expressApp) {
        this.expressApp = expressApp;
        this.camOn = false;
        this.init();
    }

    init() {
        this.expressApp.ws(BaseResource.API_BASE_URL + BASE_URL + '/stream', this._handleCameraStream.bind(this));
        this.expressApp.get(BaseResource.API_BASE_URL + BASE_URL + '/picture', this._handleCameraPicture.bind(this));

        process.on('SIGINT', () => {
            console.log("Closing Camera...");
            if (this.camOn)
                camera.EndCapture();
        });
    }

    async _handleCameraPicture(request, response) {
        try {
            if (!this.camOn) {
                camera.StartCapture();
            }
            let picData = await camera.ReadFrame();
            response.contentType('image/jpeg').send(Buffer.from(picData, 'binary'));
            if (!this.camOn) {
                camera.EndCapture();
            }
        } catch (err) {
            console.log("Unable to read frame: " + err);
            response.status(500).send("Error getting frame: " + err);
        }
    }

    _handleCameraStream(ws, request) {
        console.log("Connection");
        let err = camera.StartCapture();
        if (err) {
            console.error(err);
            ws.send("Unable to start camera: " + err);
            ws.close();
            return;
        }
        this.camOn = true;
        console.log("Camera Started");
        
        ws.on('close', req => {
            console.log("Disconnect");
            camera.EndCapture();
            this.camOn = false;
            console.log("Camera Stopped");
        });
        
        ws.on('message', async (msg) => {
            const frame = await camera.ReadFrame();
            const buf = Buffer.from(frame, 'binary');
            ws.send(
                msg == "base64"
                    ? "data:image/jpeg;base64," + buf.toString('base64')
                    : buf
            );
        });

        ws.send("started");
    }
}

module.exports = CameraResource;