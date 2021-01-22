var GpioModel = require('../models/gpio');
var gpios = require('../gpio/gpio');

gpios.init();

exports.getAllGpios = function () {
    var gpioModels = [];

    gpios.forEach(value => {
        gpioModels.push(GpioModel.fromGpioDefinition(value));
    });

    return gpioModels;
}

exports.getGpioById = function (id) {
    if (gpios.gpios.hasOwnProperty(id + '')) {
        return GpioModel.fromGpioDefinition(gpios.gpios[id + '']);
    }

    return null;
}