//dependencies
import {
	CommandInteraction,
	SlashCommandBuilder,
	ColorResolvable,
	EmbedBuilder,
	PermissionsBitField,
	Role,
	GuildTextBasedChannel
} from "discord.js";
import {
	getGuild,
	getGuildColor,
	getGuildSettingsManagerId,
	updateGuildAnnounceEvents,
	updateGuildAnnouncerId,
	updateGuildColor,
	updateGuildColorList,
	updateGuildCrosspostEventsAnnounce,
	updateGuildEventAnnounceChannelId,
	updateGuildModeratorId,
	updateGuildSettingsManagerId
} from "../functions/databaseAPI";
import { serverInfoEmbedColor, userColors } from "../config.json";
import log from "../logger";
import { checkUserPerms } from "../functions/utilities";

//command
export = {
	name: "settings",

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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("announce-events")
				.setDescription(
					"Whether or not the bot should announce events and where."
				)
				.addBooleanOption((option) =>
					option
						.setName("value")
						.setDescription(
							"The announce events toggle. Default is false."
						)
						.setRequired(true)
				)
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription(
							"The location where these announcements will be posted."
						)
						.setRequired(true)
				)
				.addBooleanOption((option) =>
					option
						.setName("crosspost")
						.setDescription(
							"Whether or not to crosspost event announcements."
						)
						.setRequired(false)
				)
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;
		await interaction.deferReply({ ephemeral: true });

		//get guildDB entry for current server
		const DBEntry = await getGuild(interaction.guildId as string);

		switch (interaction.options.getSubcommand()) {
			case "view": {
				const embedInfo = `**Colors:** ${DBEntry.colors}\n**Settings Manager Role ID:** ${DBEntry.settingsManagerRoleId}\n**Moderator Role ID:** ${DBEntry.moderatorRoleId}\n**Announcer Role ID:** ${DBEntry.announcementRoleId}\n**Announce Events:** ${DBEntry.announceEvents}\n**Event Announcement Channel ID:** ${DBEntry.eventAnnounceChannelId}`;

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
				//check if user has permission to change settings
				const settingsManagerRoleId = await getGuildSettingsManagerId(
					interaction.guildId as string
				);
				if (checkUserPerms(interaction, settingsManagerRoleId)) {
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

				//tell user it was successful
				await interaction.editReply(
					"**Successfully updated setting!**\nNow updating roles, this may take a moment..."
				);
				log.info(
					`${interaction.user.tag} updated guild color settings for ${interaction.guild?.name}.`
				);

				//update color roles
				if (newValue) {
					const position = interaction.guild?.roles.cache.find(
						(role) =>
							role.name == interaction.client.user.username &&
							role.members.some(
								(user) =>
									user.id == process.env.DISCORD_BOT_CLIENT_ID
							)
					)?.position as number;
					const colorList = ["N/A"];
					for (let i = 1; i < userColors.length; i++) {
						await interaction.guild?.roles
							.create({
								name: userColors[i].name,
								color: userColors[i].code as ColorResolvable,
								hoist: false,
								permissions: new PermissionsBitField(),
								position: position,
								mentionable: false
							})
							.then((role) => {
								colorList.push(role.id);
							});
					}

					await updateGuildColorList(
						interaction.guildId as string,
						colorList
					);
				} else {
					let colorList = (await getGuildColor(
						interaction.guildId as string
					)) as Array<string>;

					for (let i = 1; i < colorList.length; i++) {
						await interaction.guild?.roles.delete(colorList[i]);
					}

					colorList = ["N/A"];

					await updateGuildColorList(
						interaction.guildId as string,
						colorList
					);
				}

				//update DB
				await updateGuildColor(interaction.guildId as string, newValue);

				interaction.followUp({
					content: "**All roles have been updated successfully!**",
					ephemeral: true
				});
				log.info(
					`${interaction.user.tag} updated color roles in ${interaction.guild?.name}`
				);
				break;
			}

			case "settings-permissions": {
				//check if user has permission to change settings
				if (interaction.user.id != interaction.guild?.ownerId) {
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
					interaction.guildId as string,
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
				//check if user has permission to change settings
				const settingsManagerRoleId = await getGuildSettingsManagerId(
					interaction.guildId as string
				);
				if (checkUserPerms(interaction, settingsManagerRoleId)) {
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
					interaction.guildId as string,
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
				//check if user has permission to change settings
				const settingsManagerRoleId = await getGuildSettingsManagerId(
					interaction.guildId as string
				);
				if (checkUserPerms(interaction, settingsManagerRoleId)) {
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
					interaction.guildId as string,
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

			case "announce-events": {
				//check if user has permission to change settings
				const settingsManagerRoleId = await getGuildSettingsManagerId(
					interaction.guildId as string
				);
				if (checkUserPerms(interaction, settingsManagerRoleId)) {
					await interaction.editReply(
						"You do not have permissions to run this command."
					);
					log.warn(
						`${interaction.user.tag} attempted to change guild settings without permission.`
					);
					return;
				}

				//get the new values
				const newSetting = interaction.options.getBoolean(
					"value"
				) as boolean;
				const newCrosspost = interaction.options.getBoolean(
					"crosspost"
				) as boolean;
				const newChannel = interaction.options.getChannel(
					"channel"
				) as GuildTextBasedChannel;

				//get output and update settings
				let output = "**Update Announce Events Settings!**";
				if (newSetting) {
					//test values
					let crosspost,
						send = true;
					try {
						await newChannel
							.send(
								"**Big Chungus Test Message**\nThis message is of no importance. Feel free to ignore/delete it."
							)
							.then(async (message) => {
								if (newCrosspost) {
									try {
										await message.crosspost();
									} catch (error) {
										crosspost = false;
									}
								}

								await message.delete();
							});
					} catch (error) {
						send = false;
					}

					//save values and prepare output
					if (send) {
						updateGuildAnnounceEvents(
							interaction.guildId as string,
							true
						);
						updateGuildEventAnnounceChannelId(
							interaction.guildId as string,
							newChannel.id
						);
						output += "\nEnabled Event Announcements.";
					} else {
						output +=
							"\nCouldn't enable Event Announcements, invalid channel.";
					}

					if (newCrosspost && crosspost) {
						updateGuildCrosspostEventsAnnounce(
							interaction.guildId as string,
							true
						);
						output += "\nEnabled Event Announcements crossposting.";
					} else {
						output +=
							"\nCouldn't enable Event Announcements crossposting, channel is not an Announcement Channel.";
					}
				}

				//tell user it was successful
				await interaction.editReply(output);
				log.info(
					`${interaction.user.tag} updated announce event settings in ${interaction.guild?.name}.`
				);
				break;
			}
		}
	}
};
