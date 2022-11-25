//libraries
import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, User, Guild, ColorResolvable } from "discord.js";
import { userDBEntry, userDBFuncs } from "../types";
import functions from "../functions/_functionList";
import log from "../logger";
const { userInfoEmbedColor, serverInfoEmbedColor } = require("../configuration/embedColors.json");

//command information
export = {
	name: "info",
	ephemeral: false,

	//build the command
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
    
    //when command is called run the following
    async execute(interaction:CommandInteraction){
		//check if the command is a slash command
		if(!interaction.isChatInputCommand()) return;

		//if the command user is run do the following
		switch(interaction.options.getSubcommand()){
			case "user":{
				//get user input
				const user = interaction.options.getUser("user") as User;

				//userDB entry on user
				const userDB = functions.get("userDB") as userDBFuncs;
				const potentialUserEntry = await userDB.read(user.id);
				let userEntry = null;
				if (potentialUserEntry != 1) userEntry = potentialUserEntry as userDBEntry;

				//create information
				const userInfo = `Username: ${user.username}\nTag: ${user.tag}\nUser ID: ${user.id}\nIs User a Bot: ${user.bot}\nUser joined Discord: <t:${Math.floor(user.createdTimestamp / 1000)}:D>\nTitle: ${await userDB.getTitle(user.id)}`;

				//get a valid color
				let color:string = "N/A";
				if(userEntry != null) color = userEntry.color;
				if(color == "N/A") color = userInfoEmbedColor;
				
				//create response message
				const embed = new EmbedBuilder()
					.setColor(color as ColorResolvable)
					.setDescription(userInfo)
					.setTitle(`Information about ${user.username}`)
					.setThumbnail(user.displayAvatarURL());
	
				//send response
				await interaction.editReply({embeds: [embed]});
	
				//log that command was run
				log.info(`${interaction.user.tag} requested information about ${user.tag}.`);
	
				//prevent unecessery checks
				break;
			}

			case "server":{
				//create information
				const guild = interaction.guild as Guild;
				const serverInfo = `Server Name: ${guild.name}\nServer Id: ${guild.id}\nMember Count: ${guild.memberCount}\nServer Created: <t:${Math.floor(guild.createdTimestamp / 1000)}:D>`;

				//create response message
				const embed = new EmbedBuilder()
					.setColor(serverInfoEmbedColor)
					.setDescription(serverInfo)
					.setTitle(`Information about ${guild.name}`)
					.setThumbnail(guild.iconURL());

				//send response
				await interaction.editReply({embeds: [embed]});

				//log that command was run
				log.info(`${interaction.user.tag} requested information about ${guild.name}.`);

				//prevent unecessery checks
				break;
			}
		}	
    }
};
