import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	renameSync,
	unlinkSync,
	writeFileSync
} from "node:fs";
import { ScheduledTask, schedule } from "node-cron";
import { join } from "path";
import pino, { Logger } from "pino";
import compress from "@libs/utils/compress";

/**
 * Is used to log stuff to the console and log files.
 *
 * Also manages log files ensuring all log files are saved,
 * using a minimal amount of space. The logger keeps the log files
 * for the last 7 days, anything older is deleted.
 * The files are named in the format `log-YYYY-MM-DD.log` and contain
 */
class Logs {
	private logger!: Logger;
	private logFileDir!: string;
	private cronTask!: ScheduledTask;

	/**
	 * Creates a new Logger using pino logger as a base.
	 * @param logFileDir The directory all log files will be stored in.
	 */
	constructor(logFileDir: string) {
		let DEV_ENV = process.env.DEV_ENV as boolean | undefined;
		if (DEV_ENV == undefined) DEV_ENV = false;
		const logLevel = DEV_ENV ? "debug" : "info";

		this.logFileDir = logFileDir;

		if (DEV_ENV) {
			this.logger = pino({
				level: logLevel,
				transport: {
					targets: [
						{
							level: logLevel,
							target: "pino-pretty",
							options: {
								colorize: true,
								translateTime: "yyyy-mm-dd HH:MM:ss",
								ignore: "pid,hostname",
								sync: true
							}
						}
					]
				}
			});
		} else {
			this.logger = pino({
				level: logLevel,
				transport: {
					targets: [
						{
							level: logLevel,
							target: "pino-pretty",
							options: {
								colorize: true,
								translateTime: "yyyy-mm-dd HH:MM:ss",
								ignore: "pid,hostname",
								sync: false
							}
						},
						{
							level: logLevel,
							target: "pino/file",
							options: {
								destination: join(dir, "latest.log"),
								append: true,
								sync: false
							}
						}
					]
				}
			});
		}

		if (DEV_ENV) {
			this.logger.debug("Logger fully started and ready!");
			return;
		}

		// setup cron task for compressing old logs.
		this.logger.debug("Logger initialised, preparing logger cron tasks...");

		const cronTaskDate = new Date(Date.now());
		this.cronTask = schedule(
			`${cronTaskDate.getUTCMinutes()} ${cronTaskDate.getUTCHours()} * * *`,
			this.cronTaskRun,
			{
				scheduled: true,
				timezone: "Etc/UTC"
			}
		);

		this.logger.debug("Logger fully started and ready!");
	}

	/**
	 * Compresses the latest log into a daily log file and delete the seven oldest log file.
	 */
	private async cronTaskRun() {
		this.logger.debug("Archiving daily log...");

		const latestLog = join(this.logFileDir, "latest.log");
		const nowDate = new Date(Date.now());
		const logFile = join(
			this.logFileDir,
			`log-${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth()}-${nowDate.getUTCDate()}.log`
		);

		this.logger.debug("Flushing log and copying...");
		this.logger.flush();
		copyFileSync(latestLog, logFile);

		this.logger.debug("Emptying latest.log...");
		writeFileSync(latestLog, "");

		this.logger.debug("Compressing log...");
		await compress(logFile.split(".log")[0], logFile);

		this.logger.debug("Checking for stale log file...");
		const logFiles = readdirSync(this.logFileDir).filter(
			(file) => !file.includes("latest.log")
		);
		if (logFiles.length > 7) {
			let oldestDate = new Date(Date.now());
			let oldestFile = logFiles[0];

			logFiles.forEach((file) => {
				const match = file.match(/\d{4}-\d{2}-\d{2}/);
				if (!match) return;

				const currentDate = new Date(match[0]);
				if (currentDate < oldestDate) {
					oldestDate = currentDate;
					oldestFile = file;
				}
			});

			this.logger.debug("Deleting oldest log file...");
			unlinkSync(oldestFile);
		} else {
			this.logger.debug("No stale log file found.");
		}

		this.logger.info("Logger ran daily archiving task successfully.");
	}

	/**
	 * Should be run when the program ends.
	 * This ensures all the log files can be inspected later.
	 * @param fatal Whether the function is run by the `Logs#fatal`. **Do not touch!**
	 */
	public shutdown(fatal?: boolean) {
		if (!fatal) {
			this.logger.debug(
				"Logger is beeing shutdown, all messages are being flushed..."
			);
			this.logger.flush();
			this.logger.debug(
				"All messages have been flushed. Stopping CRON tasks..."
			);
		}

		if (this.cronTask != undefined) this.cronTask.stop();

		if (!fatal)
			this.logger.debug("All CRON tasks stopped. Logger has shutdown.");
	}

	/**
	 * Log something for debug purpose, like the state
	 * of a variable.
	 *
	 * **Debug is only availible when `DEV_ENV` environment
	 * variable is set to true.**
	 * @param message A log message.
	 * @param object The variable that needs to be logged.
	 */
	public async debug(message: string, object?: unknown) {
		if (object) {
			this.logger.debug(object, message);
		} else {
			this.logger.debug(message);
		}
	}

	/**
	 * Log something.
	 * @param message The message that will be logged.
	 */
	public async info(message: string) {
		this.logger.info(message);
	}

	/**
	 * Log a warning.
	 * @param message A warning message.
	 * @param error An error that got thrown with the warning.
	 */
	public async warn(message: string, error?: Error) {
		if (error != undefined) {
			this.logger.warn(error, message);
		} else {
			this.logger.warn(message);
		}
	}

	/**
	 * Log an error. This error shouldn't cause the program to exit.
	 * @param error The error getting logged.
	 * @param message A nice message to go along with it.
	 */
	public async error(error: Error, message?: string) {
		if (message != undefined) {
			this.logger.error(error, message);
		} else {
			this.logger.error(
				error,
				"An error has occured, no message was provided!"
			);
		}
	}

	/**
	 * Log a fatal error, these errors should cause the program to crash
	 * and this should be the final log message.
	 * This will automatically shutdown the logger as well.
	 * @param error The error getting logged.
	 * @param message A nice message to go along with it.
	 */
	public fatal(error: Error, message?: string) {
		if (message != undefined) {
			this.logger.fatal(error, message);
		} else {
			this.logger.fatal(
				error,
				"A fatal error has occured, no message was provided!"
			);
		}

		const crashReportDir = join(this.logFileDir, "crash-reports");
		if (!existsSync(crashReportDir)) mkdirSync(crashReportDir);
		const nowDate = new Date(Date.now());
		writeFileSync(
			join(
				crashReportDir,
				`crash_report:${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth()}-${nowDate.getUTCDate()}_${nowDate.getUTCHours()}:${nowDate.getUTCMinutes()}:${nowDate.getUTCSeconds()}.txt`
			),
			`${error.name}\n"${error.message}"\n\n${
				error.stack ? error.stack : "No stacktrace provided!"
			}`
		);

		this.shutdown(true);
	}

	/**
	 * Logs that a Discord event has been recieved by the client.
	 * @param name The name of the event.
	 * @param source The source of the event, so the guild or user or scheduled event, etc.
	 */
	public async eventRecieved(name: string, source: string) {
		this.logger.debug(
			`Recieved event ${name} from ${source} and executing the event's code...`
		);
	}

	public async eventIgnored(name: string, source: string) {
		log.debug(`Event "${name}" from ${source} was ignored.`);
	}

	/**
	 * Logs that a Discord event's code has been executed successfully.
	 * @param name The name of the event.
	 * @param source The source of the event, so the guild or user or scheduled event, etc.
	 */
	public async eventExecuted(name: string, source: string) {
		this.logger.info(`Executed event "${name}" from ${source}.`);
	}

	/**
	 * Logs that a Discord event has been recieved by the client.
	 * @param name The name of the event.
	 * @param source The source of the event, so the guild or user or scheduled event, etc.
	 */
	public async commandExecuted(name: string, source: string) {
		this.logger.info(
			`Executed and replied to command "${name}" which was ran by ${source}.`
		);
	}
}

// create the directory for the log files
const dir = join(__dirname.split("/src")[0].split("/libs")[0], "logs");
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

// Compress and store the latest.log
const latestLog = join(dir, "latest.log");
if (existsSync(latestLog) && readFileSync(latestLog).length == 0) {
	const nowDate = new Date(Date.now());
	const newFileName = join(
		dir,
		`log_${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth()}-${nowDate.getUTCDate()}_${nowDate.getUTCHours()}:${nowDate.getUTCMinutes()}:${nowDate.getUTCSeconds()}.log`
	);
	renameSync(latestLog, newFileName);
	compress(newFileName);
}

// create and export the logger
const log = new Logs(dir);
export default log;
