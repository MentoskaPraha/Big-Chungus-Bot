import { defaultEmbedColor } from "$config";
import { getUserBirthday } from "@database/users";
import { replyEmbed } from "@libs/reply";
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ColorResolvable,
	time,
	Guild
} from "discord.js";

export default {
	name: "info",
	global: true,
	dev: false,
	ephemeral: false,
	defer: false,
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Get information about something")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("user")
				.setDescription("Get information about a user.")
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription(
							"The user to get the information about."
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("server")
				.setDescription("Get information about the current server.")
		),

	async execute(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case "user": {
				const target = await interaction.options
					.getUser("user", true)
					.fetch(true);

				const embed = new EmbedBuilder()
					.setColor(
						target.hexAccentColor != null
							? target.hexAccentColor
							: (defaultEmbedColor as ColorResolvable)
					)
					.setTitle(target.displayName)
					.setThumbnail(target.displayAvatarURL())
					.setDescription(
						target.bot
							? "This user is a bot and not a real person."
							: null
					)
					.addFields(
						{
							name: "ID",
							value: target.id
						},
						{
							name: "Username",
							value: target.tag
						},
						{
							name: "Joined",
							value: time(target.createdAt, "F")
						},
						{
							name: "Birthday",
							value: await getUserBirthday(target.id) == undefined ? time(await getUserBirthday(target.id) as Date, "F") : "Birthday not on record."
						}
					);

				replyEmbed(interaction, this.ephemeral, embed);

				break;
			}

			case "server": {
				const target = (await interaction.guild?.fetch()) as Guild;

				const embed = new EmbedBuilder()
					.setColor(defaultEmbedColor as ColorResolvable)
					.setTitle(target.name)
					.setThumbnail(target.iconURL())
					.setDescription(target.description)
					.addFields(
						{
							name: "ID",
							value: target.id
						},
						{
							name: "Owner",
							value: (await target.fetchOwner()).displayName
						},
						{
							name: "Created",
							value: time(target.createdAt, "F")
						},
						{
							name: "Member Count",
							value: target.memberCount.toString()
						}
					);

				replyEmbed(interaction, this.ephemeral, embed);

				break;
			}
		}
	}
};
