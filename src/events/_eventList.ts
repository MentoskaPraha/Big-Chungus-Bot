//dependencies
import { Collection } from "discord.js";
import { readFiles } from "$lib/utilities";

//event handler interface
export interface eventObject {
	name: string;
	once: boolean;
	execute(...args: unknown[]): Promise<void>;
}

//create variables
const events = readFiles(__dirname) as Collection<string, eventObject>;

//export event list
export default events;
