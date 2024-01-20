import commands, { reloadCommand } from "$commands";
import events, { reloadEvent } from "$events";
import { replySuccess } from "@libs/reply";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
	name: "reload",
	global: true,
	dev: true,
	ephemeral: true,
	defer: false,
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription(
			"Reload a specific part of the bot, like a command or event."
		)
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("command")
				.setDescription("Reload a specific command.")
				.addStringOption((option) =>
					option
						.setName("command")
						.setDescription("The command that will be reloaded.")
						.setRequired(true)
						.setAutocomplete(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("event")
				.setDescription("Reload a specific event.")
				.addStringOption((option) =>
					option
						.setName("event")
						.setDescription("The event that will be reloaded.")
						.setRequired(true)
						.setAutocomplete(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("commands")
				.setDescription("Reload all the commands.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("events")
				.setDescription("Reload all the events.")
		),

	async execute(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case "command": {
				const commandName = interaction.options.getString(
					"command"
				) as string;
				const command = commands.get(commandName);
				if (!command)
					throw new Error(
						`Command "${commandName}" was not found in the list of commands.`
					);

				reloadCommand(commandName);

				replySuccess(
					interaction,
					this.ephemeral,
					`Successfully reloaded command "${commandName}".`
				);
				break;
			}

			case "commands": {
				commands.forEach((command) => reloadCommand(command.name));
				replySuccess(
					interaction,
					this.ephemeral,
					"Successfully reloaded all commands!"
				);
				break;
			}

			case "event": {
				const eventName = interaction.options.getString(
					"event"
				) as string;
				const event = events.get(eventName);
				if (!event)
					throw new Error(
						`Event "${eventName}" was not found in the list of events.`
					);

				reloadEvent(eventName, interaction.client);

				replySuccess(
					interaction,
					this.ephemeral,
					`Successfully reloaded event "${eventName}".`
				);
				break;
			}

			case "events": {
				events.forEach((event) =>
					reloadEvent(event.name, interaction.client)
				);
				replySuccess(
					interaction,
					this.ephemeral,
					"Successfully reloaded all events!"
				);
				break;
			}
		}
	}
};
