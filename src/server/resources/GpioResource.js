const BaseResource = require('./BaseResource');
const gpioService = require('../services/GpioService');
const wiringPiService = require('../services/WiringPiService');

const BASE_URL = '/v1/gpios';

class GpioResource {

    constructor(expressApp) {
        this.expressApp = expressApp;

        this.init();
    }

    init() {
        this.expressApp.get(BaseResource.API_BASE_URL + BASE_URL, this._handleGetAllRequest.bind(this));
        this.expressApp.get(BaseResource.API_BASE_URL + BASE_URL + '/:gpioId', this._handleGetRequest.bind(this));
        this.expressApp.put(BaseResource.API_BASE_URL + BASE_URL + '/:gpioId', this._handlePutRequest.bind(this));
    }

    _handleGetAllRequest(request, response) {
        response.status(200).send(gpioService.getAllGpios());
    }

    _handleGetRequest(request, response) {
        const gpioId = request.params.gpioId;
        const gpioModel = gpioService.getGpioById(gpioId);

        if (gpioModel != null) {
            response.status(200).send(gpioModel);
        } else {
            response.status(404).send('Gpio: ' + gpioId + ' does not exist. May not be a GPIO pin.');
        }
    }

    _handlePutRequest(request, response) {
        const gpioId = request.params.gpioId;
        const gpioModel = gpioService.getGpioById(gpioId);



        if (gpioModel != null) {
            wiringPiService.setPinStatus(gpioModel, 0.0);
            response.status(200).send(gpioModel);
        } else {
            response.status(404).send('Gpio: ' + gpioId + ' does not exist. May not be a GPIO pin.');
        }
    }
}

module.exports = GpioResource;