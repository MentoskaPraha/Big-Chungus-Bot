//dependencies
import { Collection } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { eventObject } from "../types";

//create variables
const items = new Collection<string, eventObject>();
const itemPath = join(__dirname);
const itemFiles = readdirSync(itemPath).filter(
	(file) => file.endsWith(".js") && !file.startsWith("_")
);

//get the items
for (const file of itemFiles) {
	const filePath = join(itemPath, file);
	const item = import(filePath) as unknown as eventObject;
	items.set(item.name, item);
}

//export item list
export = items;
