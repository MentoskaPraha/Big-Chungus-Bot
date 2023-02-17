//dependancies
import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	ColorResolvable
} from "discord.js";
import log from "../logger";
import { botStatusEmbedColor } from "../config.json";

//command
export = {
	name: "status",
	ephemeral: false,

	//command data
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Returns the status of the bot.")
		.setDMPermission(true),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const embed = new EmbedBuilder()
			.setTitle("Bot Status")
			.setDescription("Here is the bot's current status information.")
            .addFields(
                {name: "WS Latency", value: `${Math.round(interaction.client.ws.ping)}ms`},
                {name: "WS Status", value: `${interaction.client.ws.status}`}
            )
			.setColor(botStatusEmbedColor as ColorResolvable);

		//respond to the user
		await interaction.editReply({ embeds: [embed] });

		log.info(`${interaction.user.tag} has requested status information.`);
	}
};
