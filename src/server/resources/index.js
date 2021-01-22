const GpioResource = require('./GpioResource');
const CameraResource = require('./CameraResource');
const DoorResource = require('./DoorResource');

const Resources = [
    CameraResource,
    DoorResource,
    GpioResource
];

module.exports = expressApp => {
    console.log('Initializing the resource routes.');
    return Resources.map(Resource => new Resource(expressApp));
}