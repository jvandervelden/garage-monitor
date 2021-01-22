const express = require('express');
const expressWs = require('express-ws');
const resourceInit = require('./resources');

const app = express();
const port = 3000;
expressWs(app, undefined, { wsOptions: { clientTracking: true }});

process.on('SIGINT', () => {
    console.log("Closing Server...");
    server.close();
});

resourceInit(app);
app.use('/', express.static('src/static'));

const server = app.listen(port, () => {
    console.log(`Listening at on port ${port}`)
});