import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import commands, { refreshCommand } from "$commands";
import { replySuccess } from "@libs/reply";
import events, { refreshEvent } from "$events";

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

				refreshCommand(commandName);

				replySuccess(
					interaction,
					this.ephemeral,
					`Successfully refreshed command "${commandName}".`
				);
				break;
			}

			case "commands": {
				commands.forEach((command) => refreshCommand(command.name));
				replySuccess(
					interaction,
					this.ephemeral,
					"Successfully refreshed all commands!"
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
						`Command "${eventName}" was not found in the list of commands.`
					);

				refreshEvent(eventName, interaction.client);

				replySuccess(
					interaction,
					this.ephemeral,
					`Successfully refreshed event "${eventName}".`
				);
				break;
			}

			case "events": {
				events.forEach((event) =>
					refreshEvent(event.name, interaction.client)
				);
				replySuccess(
					interaction,
					this.ephemeral,
					"Successfully refreshed all events!"
				);
				break;
			}
		}
	}
};
