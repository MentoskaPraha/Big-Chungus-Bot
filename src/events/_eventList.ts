//dependencies
import { Collection } from "discord.js";
import { eventObject } from "../types";
import { readFiles } from "../functions/utilities";

//create variables
const events = readFiles(__dirname) as Collection<string, eventObject>;

//export event list
export default events;
