import { existsSync, mkdirSync } from "node:fs";
import { join } from "path";
import pino, { Logger } from "pino";
import pretty from "pino-pretty";

class Logs {
	private logger!: Logger;
	private logFileDir!: string;

	/**
	 * Creates a new Logger using pino logger as a base.
	 * @param destinationFile The initial log file, logs will be streamed to.
	 * @param logFileDir The directory all log files will be stored in.
	 */
	constructor(destinationFile: string, logFileDir: string) {
		const streams = [
			{
				stream: pino.destination({
					dest: destinationFile,
					append: true,
					sync: process.env.DEV_ENV as boolean | undefined
				})
			},
			{
				stream: pretty({
					colorize: true,
					sync: process.env.DEV_ENV as boolean | undefined
				})
			}
		];

		this.logger = pino({ level: "info" }, pino.multistream(streams));
		this.logFileDir = logFileDir;
	}

	/**
	 * Log something.
	 * @param message The string that will be logged.
	 */
	info(message: string) {
		this.logger.info(message);
	}

	/**
	 * Log a warning. At least one parameter should be provided.
	 * @param message A warning message.
	 * @param error An error that got thrown with the warning.
	 */
	warn(message: string | undefined, error: Error | undefined) {
		if (message != undefined && error != undefined) {
			this.logger.warn(`${message}\n${error}`);
			return;
		}

		if (message != undefined && error == undefined) {
			this.logger.warn(message);
			return;
		}

		if (message == undefined && error != undefined) {
			this.logger.warn(`Warning:\n${error}`);
			return;
		}

		this.logger.warn(
			"A warning has been logged by the system, but no error or message has been provided!"
		);
	}

	/**
	 * Log an error. This error shouldn't cause the program to exit.
	 * @param error The error getting logged.
	 * @param message A nice message to go along with it.
	 */
	error(error: Error, message: string | undefined) {
		if (message != undefined) {
			this.logger.error(`${message}\n${error}`);
		} else {
			this.logger.error(`An error has occured:\n${error}`);
		}
	}

	/**
	 * Log a fatal error, these errors should cause the program to crash.
	 * @param error The error getting logged.
	 * @param message A nice message to go along with it.
	 */
	fatal(error: Error, message: string | undefined) {
		if (message != undefined) {
			this.logger.error(`${message}\n${error}`);
		} else {
			this.logger.error(
				`A fatal error has occured, program exited:\n${error}`
			);
		}
	}
}

// create the directory for the log files
const dir = join(__dirname.split("/src")[0].split("/libs")[0], "data", "logs");
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

// get the name of the intial log file
const dateNow = new Date(Date.now());
const logFile = join(
	dir,
	`${dateNow.getUTCDate()}:${dateNow.getUTCMonth()}:${dateNow.getUTCFullYear()}-${dateNow.getUTCHours()}:${dateNow.getUTCMinutes()}.log`
);

// create and export the logger
const logs = new Logs(logFile, dir);
export default logs;
