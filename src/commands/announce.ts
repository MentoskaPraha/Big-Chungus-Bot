//dependacies
import {
	SlashCommandBuilder,
	EmbedBuilder,
	CommandInteraction,
	Role,
	GuildMemberRoleManager,
	GuildTextBasedChannel,
	ColorResolvable,
} from "discord.js";
import log from "../logger";
import { getUserTitle } from "../functions/userDatabase";
import { announcementEmbedColor, announcerRoleId } from "../config.json";

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
		)
		.addStringOption((option) =>
			option
				.setName("announcement")
				.setDescription("The announcement itself.")
				.setRequired(true)
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

		//check if user has permissions to make the announcement
		if (
			!(interaction.member?.roles as GuildMemberRoleManager).cache.some(
				(role: Role) => role.id == announcerRoleId
			)
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
		const channel = interaction.options.getChannel(
			"channel"
		) as GuildTextBasedChannel;

		//update the title
		if (title == null) title = "New Announcement!";

		//create the embed
		const embed = new EmbedBuilder()
			.setColor(announcementEmbedColor as ColorResolvable)
			.setTitle(title)
			.setDescription(announcement);

		//create the message
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

		//send the message to the channel
		channel.send({ content: message, embeds: [embed] });

		//give confirmation to the user that the command was successful
		await interaction.editReply(
			"Your announcement has been sent.\nIf you wish to crosspost it you must do it manually!"
		);
		log.info(`${interaction.user.tag} made an anouncement.`);
	},
};
