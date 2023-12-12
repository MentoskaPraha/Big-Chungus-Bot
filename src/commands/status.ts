import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { replySuccess } from "@libs/reply";

export default {
	name: "status",
	global: true,
	dev: false,
	ephemeral: false,
	defer: false,
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Get the status of the bot.")
		.setDMPermission(true),

	async execute(interaction: ChatInputCommandInteraction) {
		await replySuccess(
			interaction,
			`Ping: ${interaction.client.ws.ping}`,
			this.ephemeral
		);
	}
};
