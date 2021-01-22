const WiringPiService = require('./WiringPiService');
const gpioService = require('./GpioService');

const DOOR_1_PIN = '3';
const DOOR_2_PIN = '5';

console.log('Configuring door pins...');
const door1Pin = gpioService.getGpioById(DOOR_1_PIN);
const door2Pin = gpioService.getGpioById(DOOR_2_PIN);
WiringPiService.setPinConfig(door1Pin, WiringPiService.PIN_TYPES.SWITCH);
WiringPiService.setPinConfig(door2Pin, WiringPiService.PIN_TYPES.SWITCH);
WiringPiService.setPinStatus(door1Pin, 0);
WiringPiService.setPinStatus(door2Pin, 0);

const getDoorPin = (id) => {
    switch (id) {
        case '1':
            return door1Pin;
        case '2':
            return door2Pin;
        default:
            return null;
    }
}

module.exports = {
    getDoors: () => {
        return [{
            id: '1'
        }, {
            id: '2'
        }];
    },

    toggleDoor: async (doorId) => {
        WiringPiService.setPinStatus(getDoorPin(doorId), 1);
        await new Promise(resolve => setInterval(resolve, 1000));
        WiringPiService.setPinStatus(getDoorPin(doorId), 0);
    }
};