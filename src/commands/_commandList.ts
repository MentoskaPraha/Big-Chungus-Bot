//import libraries
import { Collection } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";

//create variables
let commands = new Collection;
const itemPath = path.join(__dirname);
const itemFiles = fs.readdirSync(itemPath).filter(file => file.endsWith(".ts") && !file.startsWith("_"));

//get the commands
for (const file of itemFiles) {
	const filePath = path.join(itemPath, file);
	const command = require(filePath);
	commands.set(command.data.name, command);
}

//export command list
export = commands;
