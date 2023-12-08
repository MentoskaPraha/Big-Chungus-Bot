import { commandObject } from "$types";
import readDir from "@libs/utils/readDir";
import { Collection } from "discord.js";

const commands = new Collection<string, commandObject>();

const files = readDir(__dirname).filter((file) => {
	const fileLocal = file.split("/commands")[1].split("/")[1];
	if (
		(fileLocal.endsWith(".js") || fileLocal.endsWith(".ts")) &&
		!fileLocal.startsWith("_")
	)
		return file;
});

files.forEach((file) => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { default: item } = require(file);
	commands.set(item.name, item);
});

export default commands;

/**
 * Update the import of a specific command.
 * @param commandName The command to be updated.
 */
export function refreshCommand(commandName: string) {
	const command = commands.get(commandName);

	if (!command)
		throw new Error(
			`Command "${commandName}" could not be refreshed as it doesn't exist.`
		);

	const commandPath = readDir(__dirname)
		.filter((file) => {
			const fileLocal = file.split("/commands")[1].split("/")[1];
			if (
				(fileLocal.endsWith(".js") || fileLocal.endsWith(".ts")) &&
				!fileLocal.startsWith("_")
			)
				return file;
		})
		.find((file) => file.includes(command.name));

	if (commandPath == undefined) {
		throw new Error(
			`Could not resolve file for "${command.name}" command.`
		);
	}

	delete require.cache[require.resolve(commandPath)];

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { default: newCommand } = require(commandPath);

	commands.set(command.name, newCommand);
}
