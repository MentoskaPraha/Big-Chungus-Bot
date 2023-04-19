//dependencies
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { userDBDisconnect } from "../functions/userDatabase";
import { guildDBDisconnect } from "../functions/guildDatabase";
import log from "../logger";

//command
export = {
	name: "maintenance",

	//command data
	data: new SlashCommandBuilder()
		.setName("maintenance")
		.setDescription("Commands related to maintaning the bot.")
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("terminate")
				.setDescription("Terminates the bot.")
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		//check if the user can run the command
		if (interaction.user.id != process.env.DISCORD_BOT_OWNER_ID) {
			await interaction.reply({
				content: "You do not have permissions to run this command.",
				ephemeral: true
			});
			log.warn(
				`${interaction.user.tag} attempted to access terminate command.`
			);

			return;
		}

		switch (interaction.options.getSubcommand()) {
			case "terminate": {
				await interaction.reply({
					content: "Terminating...",
					ephemeral: true
				});

				//log out of Discord and disconnect databases
				interaction.client.destroy();
				userDBDisconnect();
				guildDBDisconnect();

				log.info(`Bot is terminated by ${interaction.user.tag}.`);

				//exit program
				process.exit(0);
			}
		}
	}
};
