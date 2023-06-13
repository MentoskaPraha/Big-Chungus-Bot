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
	name: "silence",

	//command data
	data: new SlashCommandBuilder()
		.setName("silence")
		.setDescription(
			"Silences a user preventing them from speaking. (Timeouts a user for a specified duration.)"
		)
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user that will be silenced(timed-out).")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("duration")
				.setDescription(
					"The duration in minutes the user will be silenced (timed-out)."
				)
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(40320)
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
				`${interaction.user.tag} tried to silence someone in guild-${interaction.guildId}.`
			);
			return;
		}

		const target = interaction.options.getMember("user") as GuildMember;
		const duration = interaction.options.getInteger("duration") as number;
		const reason =
			interaction.options.getString("reason") ||
			"The will of Big Chungus has commanded your silencing in this guild.";

		try {
			await target.timeout(duration * 60 * 1000, reason);
		} catch (error) {
			await interaction.editReply(
				`${target.user.username} could not be silenced.`
			);
			log.warn(
				`${interaction.user.tag} failed to timeout ${target.user.tag} in guild-${interaction.guildId}.`
			);
			return;
		}

		await interaction.editReply(
			`${target.user.username} has been silenced!`
		);

		log.info(
			`${interaction.user.tag} timed-out ${target.user.tag} in guild-${interaction.guildId}.`
		);
		return;
	}
};
