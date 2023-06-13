//dependencies
import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	TextChannel
} from "discord.js";
import log from "$lib/logger";
import { checkUserPerms } from "$lib/utilities";
import { getGuildModeratorId } from "$lib/databaseAPI";

//command
export = {
	name: "purge",

	//command data
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Burns a specified amount of message in a holy fire.")
		.setDMPermission(false)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("The amount of messages to be deleted.")
				.setRequired(true)
				.setMinValue(2)
				.setMaxValue(100)
		),

	//command code
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

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
				`${interaction.user.tag} tried to purge some messages in guild-${interaction.guildId}.`
			);
			return;
		}

		const channel = interaction.guild?.channels.cache.get(
			interaction.channelId
		) as TextChannel;
		const numDelete = interaction.options.getInteger("amount") as number;

		try {
			await channel.bulkDelete(numDelete);
		} catch (error) {
			await interaction.editReply(
				"Messages could not be deleted due to Discord limitations, please ensure the messages are under 14 days old."
			);
			log.info(
				`${interaction.user.tag} deleted ${numDelete} messages in channel-${channel.id} in guild-${interaction.guildId}.`
			);
			return;
		}

		await interaction.editReply("Messages have been deleted.");
		log.info(
			`${interaction.user.tag} deleted ${numDelete} messages in channel-${channel.id} in guild-${interaction.guildId}.`
		);
		return;
	}
};
