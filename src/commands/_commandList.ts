//dependencies
import {
	Collection,
	CommandInteraction,
	SlashCommandBuilder
} from "discord.js";
import { readFiles } from "../functions/utilities";

//command interface
export interface commandObject {
	name: string;
	data: SlashCommandBuilder;
	execute(interaction: CommandInteraction): Promise<void>;
}

//create variables
const commands = readFiles(__dirname) as Collection<string, commandObject>;

//export command list
export default commands;
