//dependancies
import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, User, Guild, ColorResolvable } from "discord.js";
import { userDBEntry, userDBFuncs } from "../types";
import functions from "../functions/_functionList";
import log from "../logger";
const { userInfoEmbedColor, serverInfoEmbedColor } = require("../config.json");

//command
export = {
	name: "info",
	ephemeral: false,

	//command data
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Gives information about something")
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand.setName("user")
				.setDescription("Get information about a user.")
				.addUserOption(option =>
					option.setName("user")
						.setDescription("The user you want information about.")
						.setRequired(true)
					)
			)
		.addSubcommand(subcommand =>
			subcommand.setName("server")
				.setDescription("Get information about this server.")
			),
    
    //command code
    async execute(interaction:CommandInteraction){
		if(!interaction.isChatInputCommand()) return;

		switch(interaction.options.getSubcommand()){
			case "user":{
				//get command options
				const user = interaction.options.getUser("user") as User;

				//userDB entry on user
				const userDB = functions.get("userDB") as userDBFuncs;
				const potentialUserEntry = await userDB.read(user.id);
				let userEntry = null;
				if (potentialUserEntry != false) userEntry = potentialUserEntry as userDBEntry;

				//create user info message
				const userInfo = `Username: ${user.username}\nTag: ${user.tag}\nUser ID: ${user.id}\nIs User a Bot: ${user.bot}\nUser joined Discord: <t:${Math.floor(user.createdTimestamp / 1000)}:D>\nTitle: ${await userDB.getTitle(user.id)}`;

				//get a valid color
				let color:string = "N/A";
				if(userEntry != null) color = userEntry.color;
				if(color == "N/A") color = userInfoEmbedColor;
				
				//create embed
				const embed = new EmbedBuilder()
					.setColor(color as ColorResolvable)
					.setDescription(userInfo)
					.setTitle(`Information about ${user.username}`)
					.setThumbnail(user.displayAvatarURL());
	
				//send response
				await interaction.editReply({embeds: [embed]});
	
				log.info(`${interaction.user.tag} requested information about ${user.tag}.`);
				break;
			}

			case "server":{
				//create information
				const guild = interaction.guild as Guild;
				const guildInfo = `Server Name: ${guild.name}\nServer Id: ${guild.id}\nMember Count: ${guild.memberCount}\nServer Created: <t:${Math.floor(guild.createdTimestamp / 1000)}:D>`;

				//create embed
				const embed = new EmbedBuilder()
					.setColor(serverInfoEmbedColor)
					.setDescription(guildInfo)
					.setTitle(`Information about ${guild.name}`)
					.setThumbnail(guild.iconURL());

				//send response
				await interaction.editReply({embeds: [embed]});

				log.info(`${interaction.user.tag} requested information about ${guild.name}.`);
				break;
			}
		}	
    }
};
