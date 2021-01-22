const zmq = require("zeromq");
const daemonSocket = zmq.socket("req");

const messageTypes = {
    CONFIG: "00",
    GPIO_MSG: "01",
    QUERY: "02"
};

const configMessages = {
    QUIT: "00",
    CLEAR_ALL: "01",
    CREATE_GPIO: "02",
    DELETE_GPIO: "03",
    DELETE_ALL: "04"
};

const gpioPinTypes = {
    PWM: "01",
    SWITCH: "02"
};

const gpioMessages = {
    SET_PIN_VALUE: "00"
};

const queryMessages = {
    GET_GPIO_STATUS: "00",
    GET_ALL_GPIO_STATUSES: "01",
    GET_DAEMON_STATUS: "02"
};

const buildMessage = function (messageType, message, value) {
    return messageType + ":" + message + ":" + value;
};

const formatValue = function (value, precision = true) {
    if (precision) {
        return lpad('0', new String(parseFloat(value + '').toFixed(3)), 7);
    } else {
        return lpad('0', new String(parseFloat(value + '')), 2);
    }
};

const formatPin = function (pin) {
    return lpad('0', new String(pin), 3);
}

const lpad = function (character, str, length) {
    let paddedStr = str;
    while (paddedStr.length < length) {
        paddedStr = character + paddedStr;
    }
    return paddedStr;
}

const buildPinValue = function (pin, value, precision = true) {
    return formatPin(pin) + ":" + formatValue(value, precision);
};

daemonSocket.connect("tcp://127.0.0.1:5555");

console.log("connected to daemon on port 5555");

daemonSocket.on("message", function (reply) {
    console.log("got reply: " + reply);
});

process.on("SIGINT", function () {
    console.log("Closing socket...");
    daemonSocket.close();
});

module.exports = {
    PIN_TYPES: gpioPinTypes,
    setPinConfig: (gpio, pinType) => {
        daemonSocket.send(buildMessage(messageTypes.CONFIG, configMessages.CREATE_GPIO, buildPinValue(gpio.wiringPiPin, pinType, false)));
    },

    setPinStatus: (gpio, value) => {
        daemonSocket.send(buildMessage(messageTypes.GPIO_MSG, gpioMessages.SET_PIN_VALUE, buildPinValue(gpio.wiringPiPin, value)));
    }
};