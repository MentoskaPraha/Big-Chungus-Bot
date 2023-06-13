//dependancies
import { Interaction, Events } from "discord.js";
import { commandObject, commandList } from "$commands";
import log from "$lib/logger";
import { getMaintenanceModeState, processCountChange } from "$lib/appState";

export = {
	name: Events.InteractionCreate,
	once: false,

	async execute(interaction: Interaction) {
		//command interaction handling
		if (interaction.isChatInputCommand()) {
			processCountChange(true);

			const command = commandList.get(
				interaction.commandName
			) as commandObject;

			//check if the command exists
			if (!command) {
				await interaction.reply({
					content:
						"Could not find command, please contact MentoskaPraha immediately!",
					ephemeral: true
				});
				log.error(
					`${interaction.user.tag} has run an unknown command!`
				);
				return;
			}

			//check if command is the status command
			if (
				(getMaintenanceModeState() &&
					interaction.commandName != "maintenance")
			) {
				processCountChange(false);
				return;
			}

			//run the command
			command.execute(interaction).catch(async (error) => {
				if(interaction.replied){
					await interaction.followUp(
						{
							content: "There was an error while executing this command.",
							ephemeral: true
						}
					);
				}
				if (
					interaction.deferred
				) {
					await interaction.editReply(
						"There was an error while executing this command."
					);
				} else {
					await interaction.reply(
						"There was an error while executing this command."
					);
				}

				log.error(
					error,
					`${interaction.user.tag} experienced an error while running a command.`
				);
			});

			processCountChange(false);
			return;
		}

		if (interaction.isAutocomplete()) {
			processCountChange(true);

			const command = commandList.get(
				interaction.commandName
			) as commandObject;

			//check if the command exists
			if (!command) {
				log.error(
					`${interaction.user.tag} has attempted to autocomplete a non-existant ${interaction.commandName} command!`
				);
				return;
			}

			//run the command
			command.autocomplete(interaction).catch(async (error) => {
				log.error(
					error,
					`${interaction.user.tag} experienced an error while autocompleting the ${interaction.commandName} command.`
				);
			});

			processCountChange(false);
			return;
		}
	}
};
