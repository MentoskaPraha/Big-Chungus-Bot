//dependancies
import pino from "pino";
import pretty from "pino-pretty";
import { existsSync, mkdirSync } from "node:fs";

//create logs folder
const dir = __dirname.split("/src")[0] + "/logs";

if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

//get log file name
const date = new Date(Date.now());
const fileName = `${date.getUTCDate()}:${date.getUTCMonth()}:${date.getUTCFullYear()}`;

//create streams
const streams = [
	{
		stream: pino.destination({
			dest: dir + "/" + fileName + ".log",
			append: true,
			sync: false
		})
	},
	{ stream: pretty({ colorize: true, sync: false }) }
];

//create logger
const logger = pino({ level: "info" }, pino.multistream(streams));

//export logger
export default logger;
