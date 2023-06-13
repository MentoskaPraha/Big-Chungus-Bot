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
	name: "lockdown",

	//command data
	data: new SlashCommandBuilder()
		.setName("lockdown")
		.setDescription("Manages the locked and unlocked state of a channel.")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("lock")
				.setDescription("Locks the channel it's run in.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("unlock")
				.setDescription("Unlocks the channel it's run in.")
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
				`${interaction.user.tag} tried to lockdown a channel in guild-${interaction.guildId}.`
			);
			return;
		}

		const channel = interaction.guild?.channels.cache.get(
			interaction.channelId
		) as TextChannel;

		switch (interaction.options.getSubcommand()) {
			case "lock": {
				channel.permissionOverwrites.create(
					channel.guild.roles.everyone,
					{
						SendMessages: false,
						SendMessagesInThreads: false,
						CreatePublicThreads: false,
						CreatePrivateThreads: false,
						AddReactions: false,
						ManageThreads: false,
						SendTTSMessages: false,
						UseApplicationCommands: false,
						SendVoiceMessages: false,
						AttachFiles: false
					}
				);
				await interaction.editReply(
					`This channel has been locked by ${interaction.user.username}.`
				);

				log.info(
					`${interaction.user.tag} has locked the channel-${channel.id} in guild-${interaction.guildId}.`
				);
				break;
			}

			case "unlock": {
				channel.permissionOverwrites.delete(
					channel.guild.roles.everyone
				);
				await interaction.editReply(
					`This channel has been unlocked by ${interaction.user.username}.`
				);

				log.info(
					`${interaction.user.tag} has unlocked the channel-${channel.id} in guild-${interaction.guildId}.`
				);
				break;
			}
		}
	}
};
