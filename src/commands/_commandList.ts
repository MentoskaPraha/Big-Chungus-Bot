//import libraries
import { Collection } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";

//create variables
let items = new Collection;
const itemPath = path.join(__dirname);
const itemFiles = fs.readdirSync(itemPath).filter(file => file.endsWith(".js") && !file.startsWith("_"));

//get the items
for (const file of itemFiles) {
	const filePath = path.join(itemPath, file);
	const item = require(filePath);
	items.set(item.name, item);
}

//export item list
export = items;
