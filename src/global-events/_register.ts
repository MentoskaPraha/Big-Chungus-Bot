import { eventObject } from "$types";
import { Collection } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const events = new Collection<string, eventObject>();

const files = readdirSync(__dirname).filter(
	(file) =>
		(file.endsWith(".js") || file.endsWith(".ts")) && !file.startsWith("_")
);

files.forEach(async (file) => {
	const filePath = join(__dirname, file);
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { default: item } = require(filePath);
	events.set(item.name, item);
});

export default events;
