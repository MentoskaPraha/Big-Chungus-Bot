import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	renameSync,
	writeFileSync
} from "node:fs";
import { ScheduledTask, schedule } from "node-cron";
import { join } from "path";
import pino, { Logger } from "pino";
import pretty from "pino-pretty";
import { compress, archive } from "@utils/compress";

/**
 * Is used to log stuff to the console and log files.
 *
 * Also manages log files ensuring all log files are saved,
 * using a minimal amount of space. The logger keeps the log files
 * for the last 7 days, the last 4 weeks and the last
 * 12 months, anything older is deleted.
 * The files are named in the format `log-[DAILY/WEEKLY/MONTHLY]_YYYY-MM-DD.log` for files
 * that only contain logs from a day, if the log file contains logs
 * from more than one day the following format is used:
 * `log-[DAILY/WEEKLY/MONTHLY]_YYYY-MM-DD:YYYY-MM-DD.log`, this is the period of time from which
 * the contained logs are.
 */
class Logs {
	private logger!: Logger;
	private logFileDir!: string;
	private dailyLogCron!: ScheduledTask;
	private weeklyLogCron!: ScheduledTask;
	private monthlyLogCron!: ScheduledTask;
	private logsDatePattern = /\d{4}-\d{2}-\d{2}/;

	/**
	 * Creates a new Logger using pino logger as a base.
	 * @param destinationFile The initial log file, logs will be streamed to.
	 * @param logFileDir The directory all log files will be stored in.
	 */
	constructor(logFileDir: string) {
		let DEV_ENV = process.env.DEV_ENV as boolean | undefined;
		if (DEV_ENV == undefined) DEV_ENV = false;

		const streams = [
			{
				stream: pino.destination({
					dest: join(dir, "latest.log"),
					append: true,
					sync: DEV_ENV
				})
			},
			{
				stream: pretty({
					colorize: true,
					sync: DEV_ENV
				})
			}
		];

		this.logger = pino(
			{
				level: DEV_ENV == true ? "debug" : "info"
			},
			pino.multistream(streams)
		);
		this.logger.debug("Logger initialised, preparing logger cron tasks...");

		// setup cron task for compressing old logs.
		this.logFileDir = logFileDir;
	}

	private async dailyLogJob() {
		this.logger.debug("Archiving daily log...");

		const latestLog = join(this.logFileDir, "latest.log");
		const nowDate = new Date(Date.now());
		const logFile = join(
			this.logFileDir,
			`log-DAILY_${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth()}-${nowDate.getUTCDate()}.log`
		);

		this.logger.debug("Flushing log and copying...");
		this.logger.flush();
		copyFileSync(latestLog, logFile);

		this.logger.debug("Emptying latest.log...");
		writeFileSync(latestLog, "");

		this.logger.debug("Compressing log...");
		await compress(logFile);

		this.logger.info("Logger ran daily archiving task successfully.");
	}

	private async weeklyLogJob() {
		this.logger.debug(
			"Archiving log from the last week, getting log files..."
		);

		const allLogs = readdirSync(this.logFileDir);
		const neededLogs: string[] = [];

		for (const log in allLogs) {
			if (log.includes(".log") && log.includes("DAILY")) {
				neededLogs.push(log);
			}
		}

		// get the oldest log file
		const oldestFile = this.getOldestLogFile(neededLogs);
		const oldestDateString = oldestFile.match(this.logsDatePattern);
		const oldestDate = new Date(
			oldestDateString ? oldestDateString[0] : Date.now()
		);

		this.logger.debug("Aquired files. Compressing now...");
		const nowDate = new Date(Date.now());
		await archive(
			neededLogs,
			join(
				this.logFileDir,
				`log-WEEKLY_${oldestDate.getUTCFullYear()}-${oldestDate.getUTCMonth()}-${oldestDate.getUTCDate()}:${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth()}-${nowDate.getUTCDate()}.tar.gz`
			)
		);

		this.logger.debug("Logger ran weekly archiving task successfully.");
	}

	private monthlyLogJob() {
		this.logger.debug(
			"Archiving logs from the last month and deleting oldest monthly log..."
		);
	}

	/**
	 * Returns the oldest log file from a list of log files,
	 * the log files should have a date in the following pattern:
	 * `YYYY-MM-DD`, if the file has 2 dates, only the first is
	 * checked.
	 * @param files The array of files to check.
	 * @returns The path of the oldest file.
	 */
	private getOldestLogFile(files: string[]) {
		let oldestDate = new Date(Date.now());
		let oldestFile = files[0];

		files.forEach((file) => {
			const match = file.match(this.logsDatePattern);
			if (!match) return;

			const currentDate = new Date(match[0]);
			if (currentDate < oldestDate) {
				oldestDate = currentDate;
				oldestFile = file;
			}
		});

		return oldestFile;
	}

	/**
	 * Should be run when the program ends.
	 * This ensures all the log files can be inspected later.
	 */
	public shutdown() {
		this.logger.debug(
			"Logger has been shutdown, all messages are being flushed."
		);
		this.logger.flush();
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
	public debug(message: string, object?: Object) {
		if (object != undefined) {
			this.logger.debug(object, message);
		} else {
			this.logger.debug(message);
		}
	}

	/**
	 * Log something.
	 * @param message The message that will be logged.
	 */
	public info(message: string) {
		this.logger.info(message);
	}

	/**
	 * Log a warning.
	 * @param message A warning message.
	 * @param error An error that got thrown with the warning.
	 */
	public warn(message: string, error?: Error) {
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
	public error(error: Error, message?: string) {
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
	}
}

// create the directory for the log files
const dir = join(__dirname.split("/src")[0].split("/libs")[0], "data", "logs");
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

// Compress and store the latest.log
const latestLog = join(dir, "latest.log");
if (existsSync(latestLog)) {
	const nowDate = new Date(Date.now());
	const newFileName = join(
		dir,
		`log_${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth()}-${nowDate.getUTCDate()}.log`
	);
	renameSync(latestLog, newFileName);
	compress(newFileName);
}

// create and export the logger
const log = new Logs(dir);
export default log;
