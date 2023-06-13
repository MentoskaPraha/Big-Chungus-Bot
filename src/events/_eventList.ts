//dependencies
import { Collection } from "discord.js";
import { readFiles } from "$lib/utilities";

//event handler interface
export interface eventObject {
	name: string;
	once: boolean;
	execute(...args: unknown[]): Promise<void>;
}

//export event list
export const eventList = readFiles(__dirname) as Collection<
	string,
	eventObject
>;

/**
 * Reloads the specified event.
 * @param eventName the name of the event to be reloaded
 * @returns true or false depending on if the action was successfull
 */
export function reloadEvent(eventName: string) {
	const event = eventList.get(eventName);

	if (!event) return false;

	let newEvent;
	try {
		delete require.cache[require.resolve(`${__dirname}/${event.name}.js`)];
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		newEvent = require(`${__dirname}/${event.name}.js`) as eventObject;
	} catch (error) {
		delete require.cache[require.resolve(`${__dirname}/${event.name}.ts`)];
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		newEvent = require(`${__dirname}/${event.name}.ts`) as eventObject;
	}

	eventList.set(newEvent.name, newEvent);

	return true;
}
