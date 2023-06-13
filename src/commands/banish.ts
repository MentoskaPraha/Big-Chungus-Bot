//dependencies
import {
	ChatInputCommandInteraction,
	GuildMember,
	SlashCommandBuilder
} from "discord.js";
import log from "$lib/logger";
import { checkUserPerms } from "$lib/utilities";
import { getGuildModeratorId } from "$lib/databaseAPI";

//command
export = {
	name: "banish",

	//command data
	data: new SlashCommandBuilder()
		.setName("banish")
		.setDescription(
			"Banishes a user to the underworld. (Bans them from the server.)"
		)
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user that will be banished(banned).")
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
				`${interaction.user.tag} tried to banish someone in guild-${interaction.guildId}.`
			);
			return;
		}

		const target = interaction.options.getMember("user") as GuildMember;
		const reason =
			interaction.options.getString("reason") ||
			"The will of Big Chungus has commanded your banishement from this guild.";

		if (!target.bannable) {
			await interaction.editReply(
				`${target.user.username} could not be banished.`
			);
			return;
		}

		await target.ban({ deleteMessageSeconds: 0, reason: reason });

		await interaction.editReply(
			`${target.user.username} has been banished!`
		);

		log.info(
			`${interaction.user.tag} banned ${target.user.tag} in guild-${interaction.guildId}.`
		);
		return;
	}
};
