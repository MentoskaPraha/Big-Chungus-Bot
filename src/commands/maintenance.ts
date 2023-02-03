//dependancies
import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	ColorResolvable
} from "discord.js";
import { userDBDisconnect } from "../functions/userDatabase";
import { guildDBDisconnect } from "../functions/guildDatabase";
import log from "../logger";
import { maintianerId, botStatusEmbedColor } from "../config.json";

//command
export = {
	name: "maintenance",
	ephemeral: false,

	//command data
	data: new SlashCommandBuilder()
		.setName("maintenance")
		.setDescription("Commands related to maintaning the bot.")
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("status")
				.setDescription("Returns the status of the bot.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("terminate")
				.setDescription("Terminates the bot.")
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		switch (interaction.options.getSubcommand()) {
			case "status": {
				const status = `
					WS Latency is around ${Math.round(interaction.client.ws.ping)}ms.\n
					WS Status: ${interaction.client.ws.status}.\n`;

				const embed = new EmbedBuilder()
					.setTitle("Bot Status")
					.setDescription(status)
					.setColor(botStatusEmbedColor as ColorResolvable);

				//respond to the user
				await interaction.editReply({ embeds: [embed] });

				log.info(
					`${interaction.user.tag} has requested status information.`
				);
				break;
			}

			case "terminate": {
				//check if the user can run the command
				if (interaction.user.id != maintianerId) {
					await interaction.editReply(
						"You do not have permissions to run this command."
					);
					log.warn(
						`${interaction.user.tag} attempted to access terminate command.`
					);

					break;
				}

				await interaction.editReply("Terminating...");

				//log out of Discord and disconnect databases
				interaction.client.destroy();
				userDBDisconnect();
				guildDBDisconnect();

				log.info(`Bot is being terminated by ${interaction.user.tag}.`);

				//exit program
				process.exit(0);
			}
		}
	}
};
