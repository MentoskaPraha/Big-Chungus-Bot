//dependencies
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { updateUserTitle } from "../functions/userDatabase";
import log from "../logger";
import { getUserDBEntry } from "../functions/utilities";

//command
export = {
	name: "title",

	//command data
	data: new SlashCommandBuilder()
		.setName("title")
		.setDescription(
			"Set your title that will be infront of your name when the bot references you."
		)
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("update")
				.setDescription("Change your title.")
				.addStringOption((option) =>
					option
						.setName("new_title")
						.setDescription("The title you wish to have.")
						.setRequired(true)
						.setMaxLength(10)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("view").setDescription("View your title.")
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("remove").setDescription("Removes your title.")
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;
		await interaction.deferReply({ ephemeral: true });

		const dbEntry = await getUserDBEntry(interaction.user.id);

		switch (interaction.options.getSubcommand()) {
			case "update": {
				//get command options
				const newTitle = interaction.options.getString("new_title");

				//update the title in userDB
				await updateUserTitle(interaction.user.id, newTitle as string);

				//respond to user
				await interaction.editReply(
					"Your title was successfully changed!"
				);
				log.info(
					`${interaction.user.tag} has successfully changed their title.`
				);

				break;
			}

			case "view": {
				//respond with user's title
				await interaction.editReply(`Your title is: ${dbEntry.title}`);
				log.info(`${interaction.user.tag} has requested their title.`);

				break;
			}

			case "remove": {
				//update the title in userDB
				await updateUserTitle(
					interaction.user.id,
					"Titleless" as string
				);

				//respond to user
				await interaction.editReply(
					"Your title was successfully removed!"
				);
				log.info(
					`${interaction.user.tag} has successfully removed their title.`
				);

				break;
			}
		}
	}
};
