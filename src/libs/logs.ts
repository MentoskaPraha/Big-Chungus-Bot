import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	renameSync,
	unlinkSync,
	writeFileSync
} from "node:fs";
import { ScheduledTask, schedule } from "node-cron";
import { join } from "path";
import pino, { Logger } from "pino";
import { compress, archive } from "@utils/compress";

/**
 * Is used to log stuff to the console and log files.
 *
 * Also manages log files ensuring all log files are saved,
 * using a minimal amount of space. The logger keeps the log files
 * for the last 7 days, the last 4 weeks and the last
 * month, anything older is deleted.
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
		const logLevel = DEV_ENV ? "debug" : "info";

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
							sync: DEV_ENV
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
		this.logger.debug("Logger initialised, preparing logger cron tasks...");

		// setup cron task for compressing old logs.
		this.logFileDir = logFileDir;

		const nowDate = new Date(Date.now());
		this.dailyLogCron = schedule(
			`${nowDate.getUTCMinutes()} ${nowDate.getUTCHours()} * * *`,
			this.dailyLogJob,
			{
				scheduled: true,
				timezone: "Etc/UTC"
			}
		);
		this.weeklyLogCron = schedule(
			`${
				nowDate.getUTCMinutes() + 5
			} ${nowDate.getUTCHours()} * * ${nowDate.getUTCDay()}`,
			this.weeklyLogJob,
			{
				scheduled: true,
				timezone: "Etc/UTC"
			}
		);
		this.monthlyLogCron = schedule(
			`${
				nowDate.getUTCMinutes() + 10
			} ${nowDate.getUTCHours()} ${nowDate.getUTCDate()} * *`,
			this.monthlyLogJob,
			{
				scheduled: true,
				timezone: "Etc/UTC"
			}
		);

		this.logger.debug("Logger fully started and ready!");
	}

	/**
	 * Compresses the latest log into a daily log file.
	 */
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

	/**
	 * Compresses all the daily log files from the last week into
	 * one weekly log archive.
	 */
	private async weeklyLogJob() {
		this.logger.debug(
			"Archiving log from the last week, getting log files..."
		);

		const allLogs = readdirSync(this.logFileDir);
		const neededLogs: string[] = [];

		for (const log in allLogs) {
			if (log.includes("DAILY")) {
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

	/**
	 * Compresses the all the weekly log files into one monthly log file
	 * and deletes the oldest monthly log file if there's more than 12.
	 */
	private async monthlyLogJob() {
		this.logger.debug("Archiving logs from the last month...");

		const allLogs = readdirSync(this.logFileDir);
		const neededLogs: string[] = [];

		for (const log in allLogs) {
			if (log.includes("WEEKLY")) {
				neededLogs.push(log);
			}
		}

		// get the oldest log file
		const oldestWeeklyLog = this.getOldestLogFile(neededLogs);
		const oldestWeeklyDateString = oldestWeeklyLog.match(
			this.logsDatePattern
		);
		const oldestWeeklyDate = new Date(
			oldestWeeklyDateString ? oldestWeeklyDateString[0] : Date.now()
		);

		this.logger.debug("Aquired files. Compressing now...");
		const nowDate = new Date(Date.now());
		await archive(
			neededLogs,
			join(
				this.logFileDir,
				`log-MONTHLY_${oldestWeeklyDate.getUTCFullYear()}-${oldestWeeklyDate.getUTCMonth()}-${oldestWeeklyDate.getUTCDate()}:${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth()}-${nowDate.getUTCDate()}.tar.gz`
			)
		);

		this.logger.debug(
			"Archived logs from last month, deleting oldest log..."
		);

		// get the oldest log file and delete it
		const monthlyLogs: string[] = [];
		for (const log in allLogs) {
			if (log.includes("MONTHLY")) {
				monthlyLogs.push(log);
			}
		}

		const oldestLog = this.getOldestLogFile(monthlyLogs);
		unlinkSync(oldestLog);

		this.logger.debug("Logger ran monthly archiving task successfully.");
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

		this.dailyLogCron.stop();
		this.weeklyLogCron.stop();
		this.monthlyLogCron.stop();

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

		const crashReportDir = join(this.logFileDir, "crash-reports");
		if (!existsSync(crashReportDir)) mkdirSync(crashReportDir);
		const nowDate = new Date(Date.now());
		writeFileSync(
			join(
				crashReportDir,
				`crash_report:${nowDate.getUTCFullYear()}-${nowDate.getUTCMonth()}-${nowDate.getUTCDate()}_${nowDate.getUTCHours()}:${nowDate.getUTCMinutes()}:${nowDate.getUTCSeconds()}.txt`
			),
			`**Error:** ${error.name}\n**Message:** ${
				error.message
			}\n**Stacktrace:**\n${
				error.stack ? error.stack : "No stacktrace provided!"
			}`
		);

		this.shutdown(true);
	}
}

// create the directory for the log files
const dir = join(__dirname.split("/src")[0].split("/libs")[0], "logs");
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
