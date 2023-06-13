//dependencies
import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	SlashCommandBuilder
} from "discord.js";
import log from "$lib/logger";
import {
	getMaintenanceModeState,
	maintenanceModeToggle,
	processCountChange,
	shutdown
} from "$lib/appState";
import { commandList, reloadCommand } from "$commands";
import { eventList, reloadEvent } from "$events";

//command
export = {
	name: "maintenance",

	//command data
	data: new SlashCommandBuilder()
		.setName("maintenance")
		.setDescription("Commands related to maintaning the bot.")
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("terminate")
				.setDescription("Terminates the bot.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("reload-command")
				.setDescription("Reloads the code for a specified command.")
				.addStringOption((option) =>
					option
						.setName("command")
						.setDescription("The command that will be reloaded.")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("reload-event")
				.setDescription("Reloads the code for a specified event.")
				.addStringOption((option) =>
					option
						.setName("event")
						.setDescription("The event that will be reloaded.")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("reload-commands")
				.setDescription("Reloads the code for all commands.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("reload-events")
				.setDescription("Reloads the code for all events.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("toggle-maintenance")
				.setDescription("Toggles maintenance mode on or off.")
		),

	//autocomplete code
	async autocomplete(interaction: AutocompleteInteraction) {
		switch (interaction.options.getSubcommand()) {
			case "reload-command": {
				const focusedValue = interaction.options.getFocused();
				const filtered = commandList.filter((command) =>
					command.name.startsWith(focusedValue)
				);

				await interaction.respond(
					filtered.map((command) => ({
						name: command.name,
						value: command.name
					}))
				);

				log.info(
					`Autocompleted ${interaction.commandName} for ${interaction.user.tag}`
				);
				break;
			}

			case "reload-event": {
				const focusedValue = interaction.options.getFocused();
				const filtered = eventList.filter((event) =>
					event.name.startsWith(focusedValue)
				);

				await interaction.respond(
					filtered.map((event) => ({
						name: event.name,
						value: event.name
					}))
				);

				log.info(
					`Autocompleted ${interaction.commandName} for ${interaction.user.tag}`
				);
				break;
			}
		}
	},

	//command code
	async execute(interaction: ChatInputCommandInteraction) {
		//check if the user can run the command
		if (interaction.user.id != process.env.DISCORD_BOT_OWNER_ID) {
			await interaction.reply({
				content: "You do not have permissions to run this command.",
				ephemeral: true
			});
			log.warn(
				`${interaction.user.tag} attempted to access terminate command.`
			);

			return;
		}

		switch (interaction.options.getSubcommand()) {
			case "terminate": {
				await interaction.reply({
					content: "Terminating...",
					ephemeral: true
				});

				log.info(`Bot is terminated by ${interaction.user.tag}.`);

				processCountChange(false);
				await shutdown(interaction.client);

				break;
			}

			case "reload-command": {
				const commandName = interaction.options.getString(
					"command",
					true
				);

				const success = reloadCommand(commandName);

				if (success) {
					await interaction.reply({
						content: `Successfully reloaded command ${commandName}.`,
						ephemeral: true
					});
					log.info(
						`${interaction.user.tag} has reloaded the command ${commandName}.`
					);
				} else {
					await interaction.reply({
						content: `Failed to reload command ${commandName} as it probably doesn't exist.`,
						ephemeral: true
					});
					log.warn(
						`${interaction.user.tag} has failed to reload the command ${commandName} as it probably doesn't exist.`
					);
				}

				break;
			}

			case "reload-event": {
				const eventName = interaction.options.getString("event", true);

				const success = reloadEvent(eventName);

				if (success) {
					await interaction.reply({
						content: `Successfully reloaded event ${eventName}.`,
						ephemeral: true
					});
					log.info(
						`${interaction.user.tag} has reloaded the command ${eventName}.`
					);
				} else {
					await interaction.reply({
						content: `Failed to reload command ${eventName} as it probably doesn't exist.`,
						ephemeral: true
					});
					log.warn(
						`${interaction.user.tag} has failed to reload the command ${eventName} as it probably doesn't exist.`
					);
				}

				break;
			}

			case "reload-commands": {
				await interaction.deferReply({ ephemeral: true });

				let success = true;
				commandList.forEach((command) => {
					const reload = reloadCommand(command.name);
					if (!reload) success = false;
				});

				if (success) {
					await interaction.editReply(
						`Successfully reloaded all commands.`
					);
					log.info(
						`${interaction.user.tag} has reloaded all command.`
					);
				} else {
					await interaction.editReply(
						`Failed to reload all commands.`
					);
					log.warn(
						`${interaction.user.tag} has failed to reload all commands.`
					);
				}

				break;
			}

			case "reload-events": {
				await interaction.deferReply({ ephemeral: true });

				let success = true;
				eventList.forEach((event) => {
					const reload = reloadEvent(event.name);
					if (!reload) success = false;
				});

				if (success) {
					await interaction.editReply(
						`Successfully reloaded all events.`
					);
					log.info(
						`${interaction.user.tag} has reloaded all events.`
					);
				} else {
					await interaction.editReply(`Failed to reload all events.`);
					log.warn(
						`${interaction.user.tag} has failed to reload all events.`
					);
				}

				break;
			}

			case "toggle-maintenance": {
				if (!getMaintenanceModeState()) {
					await maintenanceModeToggle(true, interaction.client);
				} else {
					await maintenanceModeToggle(false, interaction.client);
				}

				await interaction.reply({
					content: "Maintenance mode successfully toggled.",
					ephemeral: true
				});
				log.info(
					`${interaction.user.tag} has toggled maintenance mode.`
				);

				break;
			}
		}
	}
};
