//dependencies
import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	ColorResolvable
} from "discord.js";
import { deleteUser, getUser } from "$lib/databaseAPI";
import { userColors } from "$config";
import log from "$lib/logger";

//command
export = {
	name: "database",

	//command information
	data: new SlashCommandBuilder()
		.setName("database")
		.setDescription("Use this command to interface with the database.")
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("view")
				.setDescription("View your database information.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("delete")
				.setDescription("Deletes your profile from the database.")
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;
		await interaction.deferReply({ ephemeral: true });

		switch (interaction.options.getSubcommand()) {
			case "view": {
				//get userDB entry
				const dbEntry = await getUser(interaction.user.id);

				//build embed
				const embed = new EmbedBuilder()
					.setTitle("Your Database Information")
					.setDescription(
						`Id: ${dbEntry.userId}\nTitle: ${
							dbEntry.title
						}\nColor: ${userColors[dbEntry.color].name}`
					)
					.setColor(
						userColors[dbEntry.color].code as ColorResolvable
					);

				//give user their DB entry info
				await interaction.editReply({ embeds: [embed] });

				log.info(
					`${interaction.user.tag} viewed their database entry.`
				);
				break;
			}

			case "delete": {
				//delete user's database entry
				const success = await deleteUser(interaction.user.id);

				//tell user whether action was successful or not
				if (success == false) {
					await interaction.editReply(
						"Your database profile does not exist."
					);
					log.info(
						`${interaction.user.tag} has failed to delete their database entry.`
					);
					break;
				} else {
					await interaction.editReply(
						"Your database profile has been deleted."
					);
					log.info(
						`${interaction.user.tag} has deleted their database entry.`
					);
					break;
				}
			}
		}
	}
};
