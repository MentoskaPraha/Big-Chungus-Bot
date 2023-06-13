//dependencies
import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	Collection,
	SlashCommandBuilder
} from "discord.js";
import { readFiles } from "$lib/utilities";

//command interface
export interface commandObject {
	name: string;
	data: SlashCommandBuilder;
	autocomplete(interaction: AutocompleteInteraction): Promise<void>;
	execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

//export command list
export const commandList = readFiles(__dirname) as Collection<
	string,
	commandObject
>;

/**
 * Reloads the specified command.
 * @param commandName the name of the command to be reloaded
 * @returns true or false depending on if the action was successfull
 */
export function reloadCommand(commandName: string) {
	const command = commandList.get(commandName);

	if (!command) return false;

	let newCommand;
	try {
		delete require.cache[
			require.resolve(`${__dirname}/${command.name}.js`)
		];

		newCommand = // eslint-disable-next-line @typescript-eslint/no-var-requires
			require(`${__dirname}/${command.name}.js`) as commandObject;
	} catch (error) {
		delete require.cache[
			require.resolve(`${__dirname}/${command.name}.ts`)
		];
		newCommand = // eslint-disable-next-line @typescript-eslint/no-var-requires
			require(`${__dirname}/${command.name}.ts`) as commandObject;
	}

	commandList.set(command.name, newCommand);

	return true;
}
