//dependencies
import {
	SlashCommandBuilder,
	EmbedBuilder,
	CommandInteraction,
	User,
	Guild,
	ColorResolvable
} from "discord.js";
import { getUser, getUserTitle } from "$lib/databaseAPI";
import log from "$lib/logger";
import {
	userInfoEmbedColor,
	serverInfoEmbedColor,
	userColors
} from "$config";

//command
export = {
	name: "info",

	//command data
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Gives information about something")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("user")
				.setDescription("Get information about a user.")
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("The user you want information about.")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("server")
				.setDescription("Get information about this server.")
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;
		await interaction.deferReply();

		switch (interaction.options.getSubcommand()) {
			case "user": {
				//get command options
				const user = interaction.options.getUser("user") as User;

				//userDB entry on user
				const userEntry = await getUser(user.id);

				//create user info message
				const userInfo = `Username: ${user.username}\nTag: ${
					user.tag
				}\nUser ID: ${user.id}\nIs User a Bot: ${
					user.bot
				}\nUser joined Discord: <t:${Math.floor(
					user.createdTimestamp / 1000
				)}:D>\nTitle: ${await getUserTitle(user.id)}`;

				//get a valid color
				let color = "N/A";
				if (userEntry != null) color = userColors[userEntry.color].code;
				if (color == "N/A" || color == userColors[0].code)
					color = userInfoEmbedColor;
				if (user.id == process.env.DISCORD_BOT_CLIENT_ID)
					color = "#B4AEAE";

				//create embed
				const embed = new EmbedBuilder()
					.setColor(color as ColorResolvable)
					.setDescription(userInfo)
					.setTitle(`Information about ${user.username}`)
					.setThumbnail(user.displayAvatarURL());

				//send response
				await interaction.editReply({ embeds: [embed] });

				log.info(
					`${interaction.user.tag} requested information about ${user.tag}.`
				);
				break;
			}

			case "server": {
				//create information
				const guild = interaction.guild as Guild;
				const guildInfo = `Server Name: ${guild.name}\nServer Id: ${
					guild.id
				}\nMember Count: ${
					guild.memberCount
				}\nServer Created: <t:${Math.floor(
					guild.createdTimestamp / 1000
				)}:D>`;

				//create embed
				const embed = new EmbedBuilder()
					.setColor(serverInfoEmbedColor as ColorResolvable)
					.setDescription(guildInfo)
					.setTitle(`Information about ${guild.name}`)
					.setThumbnail(guild.iconURL());

				//send response
				await interaction.editReply({ embeds: [embed] });

				log.info(
					`${interaction.user.tag} requested information about ${guild.name}.`
				);
				break;
			}
		}
	}
};
