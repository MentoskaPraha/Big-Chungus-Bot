//libraries
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import log from "../logger";
const { maintianerId } = require("../configuration/otherIDs.json");

//command information
export = {
	name: "maintenance",

	//build command
	data: new SlashCommandBuilder()
		.setName("maintenance")
		.setDescription("Commands related to maintaning the bot.")
		.setDMPermission(true)
        .addSubcommand(subcommand =>
            subcommand.setName("ping")
                .setDescription("Returns the latency of the bot.")
            )
        .addSubcommand(subcommand =>
            subcommand.setName("terminate")
                .setDescription("Terminates the bot.")
            ),

	//run this code if the command is called
	async execute(interaction:CommandInteraction) {
		//check if the command is a slash command
		if(!interaction.isChatInputCommand()) return;

		//cycle through subcommands
		switch(interaction.options.getSubcommand()){
			//if the command is the ping command run the following
			case "ping":{
				//get latency
				const apiLatency = Math.round(interaction.client.ws.ping);
				const RHLatency = Math.floor(Math.abs(Date.now() - +interaction.createdAt));
			
				//respond to the user
				await interaction.editReply(`**Current Latency**\nAPI Latency is around ${apiLatency}ms.\nRequest Handler Latency is around ${RHLatency}ms.`);

				//log it to the command console
				log.info(`**Current Latency**\nAPI Latency is around ${apiLatency}ms.\nRequest Handler Latency is around ${RHLatency}ms.`);

				break;
			}

			//if the subcommand is terminate run the following
			case "terminate":{
				//check if the user can run the command
				if(interaction.user.id != maintianerId){
					//respond if error message if user does not have termination permission
					await interaction.editReply("You do not have permissions to run this command.");
            
            		//log action
					log.warn(`${interaction.user.tag} attempted to access maintenance commands.`);

					break;
				}

				//tell the user that the bot is being terminated
			    await interaction.editReply("Terminating...");

                //log the termination to the console
			    log.info(`Bot is being terminated by ${interaction.user.tag}.`);

                //terminate the bot
				interaction.client.destroy();
        	    process.exit(0); 
			}
		}
	},
};
