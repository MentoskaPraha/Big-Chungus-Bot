//get libraries
const pino = require('pino');
const pretty = require('pino-pretty');
const fs = require('node:fs');

//create folder
const dir = __dirname + '/volume/logs';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

//get streams
const createSonicBoom = (dest) => pino.destination({dest: dest, append: true, sync: true});
const streams = [
    {stream: createSonicBoom('./volume/logs/Session_' + Date.now() + '.log')},
    {stream: pretty({
        colorize: true,
        sync: true
    })}
];

//create logger
const logger = pino({level:'debug'}, pino.multistream(streams));

//export logger
module.exports = logger;
