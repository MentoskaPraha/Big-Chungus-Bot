import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import log from "@libs/logs";

export default {
	name: "status",
	global: true,
	ephemeral: false,
	data: new SlashCommandBuilder(),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply("Online Baby!");
		log.info("User ran status command!");
	}
};
