//dependencies
import {
	SlashCommandBuilder,
	EmbedBuilder,
	CommandInteraction,
	GuildMemberRoleManager,
	GuildTextBasedChannel,
	ColorResolvable,
	ChannelType
} from "discord.js";
import log from "../logger";
import { getUserTitle } from "../functions/userDatabase";
import { getGuildAnnouncerId } from "../functions/guildDatabase";
import { announcementEmbedColor } from "../config.json";

//command
export = {
	name: "announce",
	ephemeral: true,

	//command information
	data: new SlashCommandBuilder()
		.setName("announce")
		.setDescription("Creates an announcement.")
		.setDMPermission(false)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("The channel the announcement will be sent to.")
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		)
		.addStringOption((option) =>
			option
				.setName("announcement")
				.setDescription("The announcement itself.")
				.setRequired(true)
		)
		.addBooleanOption((option) =>
			option
				.setName("crosspost")
				.setDescription(
					"Whether to publish the message if it was sent into an announcement channel."
				)
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("title")
				.setDescription("The title of the announcement.")
				.setRequired(false)
		)
		.addMentionableOption((option) =>
			option
				.setName("ping")
				.setDescription(
					"The role/person that will be pinged, leave blank to not ping anyone."
				)
				.setRequired(false)
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		//check if user has permission to make an announcement
		const announcerRoleId = await getGuildAnnouncerId(
			interaction.guildId as string
		);
		if (
			!(interaction.member?.roles as GuildMemberRoleManager).cache.some(
				(role) => role.id == announcerRoleId
			) ||
			interaction.user.id != interaction.guild?.ownerId
		) {
			await interaction.editReply(
				"You do not have permissions to run this command."
			);
			log.warn(
				`${interaction.user.tag} attempted to run the announce command.`
			);
			return;
		}

		//get command options
		let title = interaction.options.getString("title");
		const announcement = interaction.options.getString("announcement");
		const ping = interaction.options.getMentionable("ping");
		const crosspost = interaction.options.getBoolean("crosspost");
		const channel = interaction.options.getChannel(
			"channel"
		) as GuildTextBasedChannel;

		//update title
		if (title == null) title = "New Announcement!";

		//create embed
		const embed = new EmbedBuilder()
			.setColor(announcementEmbedColor as ColorResolvable)
			.setTitle(title)
			.setDescription(announcement);

		//create message
		let message = null;
		if (ping != null) {
			message = `New Announcement by ${await getUserTitle(
				interaction.user.id
			)} ${interaction.user.username}, ${ping}.`;
		} else {
			message = `New Announcement by ${await getUserTitle(
				interaction.user.id
			)} ${interaction.user.username}.`;
		}

		//send message to channel
		let success = true;
		channel
			.send({ content: message, embeds: [embed] })
			.then(async (message) => {
				if (crosspost) {
					try {
						await message.crosspost();
					} catch (error) {
						log.error(`Failed to crosspost. ${error}`);
						success = false;
					}
				}
			});

		//give confirmation to user that the command was successful
		if (!success) {
			await interaction.editReply(
				"Your announcement has been sent and failed to crosspost."
			);
		} else {
			await interaction.editReply("Your announcement has been sent.");
		}
		log.info(`${interaction.user.tag} made an anouncement.`);
	}
};
