const BaseResource = require('./BaseResource');
const doorService = require('../services/DoorService');

const BASE_URL = '/v1/doors';

class GpioResource {

    constructor(expressApp) {
        this.expressApp = expressApp;

        this.init();
    }

    init() {
        this.expressApp.get(BaseResource.API_BASE_URL + BASE_URL, this._handleGetAllRequest.bind(this));
        this.expressApp.get(BaseResource.API_BASE_URL + BASE_URL + '/:doorId', this._handleGetRequest.bind(this));
        this.expressApp.post(BaseResource.API_BASE_URL + BASE_URL + '/:doorId', this._handlePostRequest.bind(this));
    }

    _handleGetAllRequest(request, response) {
        response.status(200).send(doorService.getDoors());
    }

    _handleGetRequest(request, response) {
        const doorId = request.params.doorId;
        const doorModel = doorService.getDoors().find(door => door.id === doorId);

        if (doorModel != null) {
            response.status(200).send(doorModel);
        } else {
            response.status(404).send('Door: ' + doorId + ' does not exist.');
        }
    }

    async _handlePostRequest(request, response) {
        const doorId = request.params.doorId;
        const doorModel = doorService.getDoors().find(door => door.id === doorId);

        if (doorModel != null) {
            await doorService.toggleDoor(doorId);
            response.status(204).send();
        } else {
            response.status(404).send('Door: ' + doorId + ' does not exist.');
        }
    }
}

module.exports = GpioResource;