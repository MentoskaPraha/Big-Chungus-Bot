//dependancies
import {
	CommandInteraction,
	SlashCommandBuilder,
	ColorResolvable,
	EmbedBuilder,
	GuildMemberRoleManager,
	PermissionsBitField,
	Role,
} from "discord.js";
import {
	createGuild,
	getGuild,
	getGuildColor,
	getSettingsManagerId,
	updateGuildAnnouncerId,
	updateGuildColor,
	updateGuildColorList,
	updateGuildModeratorId,
	updateGuildSettingsManagerId,
} from "../functions/guildDatabase";
import { serverInfoEmbedColor, userColors, clientId } from "../config.json";
import log from "../logger";
import { guildDBEntry } from "../types";

//command
export = {
	name: "settings",
	ephemeral: true,

	//command data
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Allows you to customize the behevior of the bot.")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("view")
				.setDescription("See the current settings for this server.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("colors")
				.setDescription("Whether colors should be disabled or not.")
				.addBooleanOption((option) =>
					option
						.setName("value")
						.setDescription(
							"The value of this option. Default: false"
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("settings-permissions")
				.setDescription("The role that can manage the settings.")
				.addRoleOption((option) =>
					option
						.setName("value")
						.setDescription("The value of this option. No default.")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("moderator-permissions")
				.setDescription("The role that can use moderator commands.")
				.addRoleOption((option) =>
					option
						.setName("value")
						.setDescription("The value of this option. No default.")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("announcement-permissions")
				.setDescription("The role that can run the announce command.")
				.addRoleOption((option) =>
					option
						.setName("value")
						.setDescription("The value of this option. No default.")
						.setRequired(true)
				)
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		//get guildDB entry for current server
		let potentialDBEntry = await getGuild(interaction.guild?.id as string);
		if (potentialDBEntry == null) {
			await createGuild(interaction.guild?.id as string);
			potentialDBEntry = await getGuild(interaction.guild?.id as string);
		}
		const DBEntry = potentialDBEntry as guildDBEntry;

		switch (interaction.options.getSubcommand()) {
			case "view": {
				const embedInfo = `**Colors:** ${DBEntry.colors}\n**Settings Manager Role ID:** ${DBEntry.settingsManagerRoleId}\n**Moderator Role ID:** ${DBEntry.moderatorRoleId}\n**Announcer Role ID:** ${DBEntry.announcementRoleId}`;

				const embed = new EmbedBuilder()
					.setTitle(`${interaction.guild?.name} Settings`)
					.setDescription(embedInfo)
					.setColor(serverInfoEmbedColor as ColorResolvable);

				interaction.editReply({ embeds: [embed] });
				log.info(
					`${interaction.user.tag} viewed server settings for ${interaction.guild?.name}.`
				);
				break;
			}

			case "colors": {
				//check if user has permissions to change settings
				const announcerRoleId = await getSettingsManagerId(
					interaction.guild?.id as string
				);
				if (
					!(
						interaction.member?.roles as GuildMemberRoleManager
					).cache.some((role) => role.id == announcerRoleId) ||
					interaction.user.id == interaction.guild?.ownerId
				) {
					await interaction.editReply(
						"You do not have permissions to run this command."
					);
					log.warn(
						`${interaction.user.tag} attempted to change guild settings without permission.`
					);
					return;
				}

				//get the new value
				const newValue = interaction.options.getBoolean(
					"value"
				) as boolean;

				//update the DB
				await updateGuildColor(
					interaction.guild?.id as string,
					newValue
				);

				//tell the user success
				await interaction.editReply(
					"**Successfully updated setting!**\nNow updating roles, this may take a moment..."
				);
				log.info(
					`${interaction.user.tag} updated guild color settings for ${interaction.guild?.name}.`
				);

				//update color roles
				if (newValue) {
					const position =
						(interaction.guild?.roles.cache.find(
							(role) =>
								role.name == "Big Chungus" &&
								role.members.find((user) => user.id == clientId)
									?.id == clientId
						)?.position as number) - 1;
					const colorList = ["N/A"];
					for (let i = 1; i < userColors.length; i++) {
						await interaction.guild?.roles
							.create({
								name: userColors[i].name,
								color: userColors[i].code as ColorResolvable,
								hoist: false,
								permissions: new PermissionsBitField(),
								position: position,
								mentionable: false,
							})
							.then((role) => {
								colorList.push(role.id);
							});
					}

					await updateGuildColorList(
						interaction.guild?.id as string,
						colorList
					);
				} else {
					let colorList = (await getGuildColor(
						interaction.guild?.id as string
					)) as Array<string>;

					for (let i = 1; i < colorList.length; i++) {
						await interaction.guild?.roles.delete(colorList[i]);
					}

					colorList = ["N/A"];

					await updateGuildColorList(
						interaction.guild?.id as string,
						colorList
					);
				}

				interaction.followUp(
					"**All roles have been updated successfully!**"
				);
				log.info(
					`${interaction.user.tag} updated color roles in ${interaction.guild?.name}`
				);
				break;
			}

			case "settings-permissions": {
				//check if user has permissions to change settings
				const announcerRoleId = await getSettingsManagerId(
					interaction.guild?.id as string
				);
				if (
					!(
						interaction.member?.roles as GuildMemberRoleManager
					).cache.some((role) => role.id == announcerRoleId) ||
					interaction.user.id == interaction.guild?.ownerId
				) {
					await interaction.editReply(
						"You do not have permissions to run this command."
					);
					log.warn(
						`${interaction.user.tag} attempted to change guild settings without permission.`
					);
					return;
				}

				//get the new value
				const newValue = interaction.options.getRole("value") as Role;

				//update DB
				await updateGuildSettingsManagerId(
					interaction.guild?.id as string,
					newValue.id
				);

				await interaction.editReply(
					"**Successfully update Settings Manager Role!**"
				);
				log.info(
					`${interaction.user.tag} updated Settings Manager Role in ${interaction.guild?.name}.`
				);
				break;
			}

			case "moderator-permissions": {
				//check if user has permissions to change settings
				const announcerRoleId = await getSettingsManagerId(
					interaction.guild?.id as string
				);
				if (
					!(
						interaction.member?.roles as GuildMemberRoleManager
					).cache.some((role) => role.id == announcerRoleId) ||
					interaction.user.id == interaction.guild?.ownerId
				) {
					await interaction.editReply(
						"You do not have permissions to run this command."
					);
					log.warn(
						`${interaction.user.tag} attempted to change guild settings without permission.`
					);
					return;
				}

				//get the new value
				const newValue = interaction.options.getRole("value") as Role;

				//update DB
				await updateGuildModeratorId(
					interaction.guild?.id as string,
					newValue.id
				);

				await interaction.editReply(
					"**Successfully update Moderator Role!**"
				);
				log.info(
					`${interaction.user.tag} updated Moderator Role in ${interaction.guild?.name}.`
				);
				break;
			}

			case "announcement-permissions": {
				//check if user has permissions to change settings
				const announcerRoleId = await getSettingsManagerId(
					interaction.guild?.id as string
				);
				if (
					!(
						interaction.member?.roles as GuildMemberRoleManager
					).cache.some((role) => role.id == announcerRoleId) ||
					interaction.user.id == interaction.guild?.ownerId
				) {
					await interaction.editReply(
						"You do not have permissions to run this command."
					);
					log.warn(
						`${interaction.user.tag} attempted to change guild settings without permission.`
					);
					return;
				}

				//get the new value
				const newValue = interaction.options.getRole("value") as Role;

				//update DB
				await updateGuildAnnouncerId(
					interaction.guild?.id as string,
					newValue.id
				);

				await interaction.editReply(
					"**Successfully update Announcement Role!**"
				);
				log.info(
					`${interaction.user.tag} updated Announcement Role in ${interaction.guild?.name}.`
				);
				break;
			}
		}
	},
};
