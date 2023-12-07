import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import log from "@libs/logs";
import { replySuccess } from "@libs/reply";

export default {
	name: "status",
	global: true,
	ephemeral: false,
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Get the status of the bot.")
		.setDMPermission(true),

	async execute(interaction: ChatInputCommandInteraction) {
		await replySuccess(interaction);
	}
};
