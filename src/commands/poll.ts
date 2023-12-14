import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { replySuccess } from "@libs/reply";

export default {
	name: "poll",
	global: true,
	dev: false,
	ephemeral: false,
	defer: false,
	data: new SlashCommandBuilder()
		.setName("poll")
		.setDescription("Create a simple reaction poll.")
		.setDMPermission(true),

	async execute(interaction: ChatInputCommandInteraction) {
		await replySuccess(
			interaction,
			`Ping: ${interaction.client.ws.ping}ms`,
			this.ephemeral
		);
	}
};
