//get libraries
import pino from "pino";
import pretty from "pino-pretty";
import * as fs from "node:fs";

//create folder
const dir = __dirname + "/volume/logs";
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

//get streams
const createSonicBoom = (dest: string) => pino.destination({dest: dest, append: true, sync: true});
const streams = [
    {stream: createSonicBoom(dir + "/" + `${Date.prototype.getUTCDate()}:${Date.prototype.getUTCMonth()}:${Date.prototype.getUTCFullYear}` + ".log")},
    {stream: pretty({colorize: true, sync: true})}
];

//create logger
const logger = pino({level:"info"}, pino.multistream(streams));

//export logger
export = logger;
