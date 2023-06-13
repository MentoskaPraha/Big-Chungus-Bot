//dependencies
import {
	SlashCommandBuilder,
	EmbedBuilder,
	ColorResolvable,
	ChatInputCommandInteraction
} from "discord.js";
import log from "$lib/logger";
import { botStatusEmbedColor } from "$config";
import { getMaintenanceModeState } from "$lib/appState";

//command
export = {
	name: "status",

	//command data
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Returns the status of the bot.")
		.setDMPermission(true),

	//command code
	async execute(interaction: ChatInputCommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle("Bot Status")
			.setDescription(
				!getMaintenanceModeState()
					? ":green_circle: - Online"
					: ":yellow_circle: - In Maintenance"
			)
			.addFields(
				{
					name: "WS Latency",
					value: `${Math.round(interaction.client.ws.ping)}ms`
				},
				{ name: "WS Status", value: `${interaction.client.ws.status}` }
			)
			.setColor(botStatusEmbedColor as ColorResolvable);

		//respond to user
		await interaction.reply({ embeds: [embed] });

		log.info(`${interaction.user.tag} has requested status information.`);
	}
};
