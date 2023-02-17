//dependencies
import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	ColorResolvable
} from "discord.js";
import { userDBEntry } from "../types";
import { createUser, getUser, deleteUser } from "../functions/userDatabase";
import { userColors } from "../config.json";
import log from "../logger";

//command
export = {
	name: "database",
	ephemeral: true,

	//command information
	data: new SlashCommandBuilder()
		.setName("database")
		.setDescription("Use this command to interface with the database.")
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("create")
				.setDescription("Registers your profile in the database.")
		)
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

		//get userDB entry
		const potentialDBEntry = await getUser(interaction.user.id);

		switch (interaction.options.getSubcommand()) {
			case "create": {
				//create user's database entry
				const success = await createUser(interaction.user.id);

				//tell user whether the action was successful or not
				if (success == false) {
					await interaction.editReply(
						"Your database profile already exists."
					);
					log.info(
						`${interaction.user.tag} has failed to create their database entry.`
					);
					break;
				} else {
					await interaction.editReply(
						"Your database profile has been created."
					);
					log.info(
						`${interaction.user.tag} has created their database entry.`
					);
					break;
				}
			}

			case "view": {
				//check if user has a DB entry
				if (potentialDBEntry == null) {
					await interaction.editReply(
						"You do not have a database entry!"
					);
					log.warn(
						`${interaction.user.tag} failed to view their userDB entry.`
					);
					break;
				}

				//get DB entry
				const dbEntry = potentialDBEntry as userDBEntry;

				//build embed
				const embed = new EmbedBuilder()
					.setTitle("Your Database Information")
					.setDescription(
						`Id: ${dbEntry.id}\nTitle: ${dbEntry.title}\nColor: ${
							userColors[dbEntry.color].name
						}`
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
