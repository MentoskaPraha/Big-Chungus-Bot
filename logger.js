//get libraries
const fs = require('fs');
const pino = require('pino');
const pretty = require('pino-pretty');

//get streams
const createSonicBoom = (dest) => pino.destination({dest: dest, append: true, sync: true});
const streams = [
    {stream: createSonicBoom('./logs/Session_' + Date.now() + '.log')},
    {stream: pretty({
        colorize: true,
        sync: true
    })}
];

//create logger
const logger = pino({level:'debug'}, pino.multistream(streams));

//export logger
module.exports = logger;
