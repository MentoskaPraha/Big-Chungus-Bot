import { checkBlockNew, setBlockNew } from "@database/state";
import { replyFailure, replySuccess } from "@libs/reply";
import shutdown from "@libs/shutdown";
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ActivityType
} from "discord.js";

export default {
	name: "maintenance",
	global: true,
	dev: false,
	ephemeral: true,
	defer: false,
	data: new SlashCommandBuilder()
		.setName("maintenance")
		.setDescription(
			"Used to shutdown or pause the bot for debugging, can only be ran by the bot owner."
		)
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("block-interactions")
				.setDescription(
					"Prevents new interactions from being created. Recommended to run before a shutdown."
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("shutdown")
				.setDescription(
					"Shutdown the bot immediately or after a delay."
				)
				.addIntegerOption((option) =>
					option
						.setName("delay")
						.setDescription(
							"How many minutes the bot should wait before shutting down."
						)
						.setMinValue(1)
						.setMaxValue(1440)
						.setRequired(true)
				)
		),

	async execute(interaction: ChatInputCommandInteraction) {
		if (interaction.user.id != process.env.DISCORD_OWNER_ID) {
			replyFailure(
				interaction,
				"You don't have the permissions needed to run this command!"
			);
			return;
		}

		switch (interaction.options.getSubcommand()) {
			case "block-interactions": {
				if (!(await checkBlockNew())) {
					interaction.client.user.presence.set({
						status: "dnd",
						activities: [
							{
								name: "The bot is no longer accepting new requests.",
								type: ActivityType.Custom
							}
						]
					});
					await setBlockNew(true);
				} else {
					interaction.client.user.presence.set({
						status: "online",
						activities: []
					});
					await setBlockNew(false);
				}

				replySuccess(
					interaction,
					this.ephemeral,
					"The bot's state was successfully updated!"
				);
				break;
			}

			case "shutdown": {
				await replySuccess(
					interaction,
					this.ephemeral,
					"Shutdown signal recieved..."
				);

				const delay = interaction.options.getInteger("delay", true);
				setTimeout(
					() => shutdown(interaction.client),
					delay * 60 * 1000
				);
			}
		}
	}
};
