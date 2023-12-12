import { eventObject } from "$types";
import { Client, Collection } from "discord.js";
import readDir from "@libs/utils/readDir";

const events = new Collection<string, eventObject>();

const files = readDir(__dirname).filter((file) => {
	const fileLocal = file.split("/events")[1].split("/")[1];
	if (
		(fileLocal.endsWith(".js") || fileLocal.endsWith(".ts")) &&
		!fileLocal.startsWith("_")
	)
		return file;
});

files.forEach((file) => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { default: item } = require(file);
	events.set(item.name, item);
});

export default events;

/**
 * Update the import of a specific event and the listener in the code.
 * @param eventName The command to be updated.
 * @param client The main Discord.js client.
 */
export function refreshEvent(eventName: string, client: Client) {
	const event = events.get(eventName);

	if (!event)
		throw new Error(
			`Event "${eventName}" could not be refreshed as it doesn't exist.`
		);

	const eventPath = readDir(__dirname)
		.filter((file) => {
			const fileLocal = file.split("/events")[1].split("/")[1];
			if (
				(fileLocal.endsWith(".js") || fileLocal.endsWith(".ts")) &&
				!fileLocal.startsWith("_")
			)
				return file;
		})
		.find((file) => file.includes(event.name));

	if (eventPath == undefined) {
		throw new Error(`Could not resolve file for "${event.name}" event.`);
	}

	delete require.cache[require.resolve(eventPath)];

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { default: newEvent } = require(eventPath);

	events.set(event.name, newEvent);

	client.removeAllListeners(event.name);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
