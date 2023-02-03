//dependancies
import pino from "pino";
import pretty from "pino-pretty";
import { existsSync, mkdirSync } from "node:fs";

//create logs folder
const dir = __dirname + "/logs";
if (!existsSync(dir)) {
	mkdirSync(dir, { recursive: true });
}

//get log file name
const date = new Date(Date.now());
const fileName = `${date.getUTCDate()}:${date.getUTCMonth()}:${date.getUTCFullYear()}`;

//create streams
const createSonicBoom = (dest: string) =>
	pino.destination({ dest: dest, append: true, sync: true });
const streams = [
	{ stream: createSonicBoom(dir + "/" + fileName + ".log") },
	{ stream: pretty({ colorize: true, sync: true }) }
];

//create logger
const logger = pino({ level: "info" }, pino.multistream(streams));

//export logger
export = logger;
