//dependencies
import {
	SlashCommandBuilder,
	EmbedBuilder,
	CommandInteraction,
	GuildTextBasedChannel,
	ColorResolvable,
	ChannelType
} from "discord.js";
import log from "$lib/logger";
import { getUserTitle, getGuildAnnouncerId } from "../lib/databaseAPI";
import { announcementEmbedColor } from "$config";
import { checkUserPerms } from "$lib/utilities";

//command
export = {
	name: "announce",

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
		await interaction.deferReply({ ephemeral: true });

		//check if user has permission to make an announcement
		const announcerRoleId = await getGuildAnnouncerId(
			interaction.guildId as string
		);
		if (checkUserPerms(interaction, announcerRoleId)) {
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
