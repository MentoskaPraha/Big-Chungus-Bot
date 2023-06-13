//dependencies
import {
	ChatInputCommandInteraction,
	GuildMember,
	SlashCommandBuilder
} from "discord.js";
import log from "$lib/logger";
import { getGuildModeratorId } from "$lib/databaseAPI";
import { checkUserPerms } from "$lib/utilities";

//command
export = {
	name: "smite",

	//command data
	data: new SlashCommandBuilder()
		.setName("smite")
		.setDescription(
			"Smites a user from the mortal realm, they'll be able to return. (Kicks them from the server.)"
		)
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user that will be smited(kicked).")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("The reason for this action.")
				.setRequired(false)
		),

	//command code
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		if (
			checkUserPerms(
				interaction,
				await getGuildModeratorId(interaction.guildId as string)
			)
		) {
			await interaction.editReply(
				"You do not have permission to run this command."
			);
			log.warn(
				`${interaction.user.tag} tried to smite someone in guild-${interaction.guildId}.`
			);
			return;
		}

		const target = interaction.options.getMember("user") as GuildMember;
		const reason =
			interaction.options.getString("reason") ||
			"The will of Big Chungus has commanded your smitting from this guild.";

		if (!target.kickable) {
			await interaction.editReply(
				`${target.user.username} could not be smitted.`
			);
			return;
		}

		await target.kick(reason);

		await interaction.editReply(`${target.user.username} has been smited!`);

		log.info(
			`${interaction.user.tag} kicked ${target.user.tag} in guild-${interaction.guildId}`
		);
		return;
	}
};
