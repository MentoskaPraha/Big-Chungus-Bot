//dependencies
import { Collection } from "discord.js";
import { commandObject } from "../types";
import { readFiles } from "../functions/utilities";

//create variables
const commands = readFiles(__dirname) as Collection<string, commandObject>;

//export command list
export default commands;
