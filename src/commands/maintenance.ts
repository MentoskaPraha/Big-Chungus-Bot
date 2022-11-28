//dependancies
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import log from "../logger";
const { maintianerId } = require("../config.json");

//command
export = {
	name: "maintenance",
	ephemeral: false,

	//command data
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

	//command code
	async execute(interaction:CommandInteraction) {
		if(!interaction.isChatInputCommand()) return;

		switch(interaction.options.getSubcommand()){
			case "ping":{
				//get latency
				const apiLatency = Math.round(interaction.client.ws.ping);
				const EHLatency = Math.floor(Math.abs(Date.now() - +interaction.createdAt));
			
				//respond to the user
				await interaction.editReply(`**Current Latency**\nAPI Latency is around ${apiLatency}ms.\nEvent Handler Latency is around ${EHLatency}ms.`);

				log.info(`Current Latency: API Latency is around ${apiLatency}ms. Event Handler Latency is around ${EHLatency}ms.`);
				break;
			}

			case "terminate":{
				//check if the user can run the command
				if(interaction.user.id != maintianerId){
					await interaction.editReply("You do not have permissions to run this command.");
					log.warn(`${interaction.user.tag} attempted to access terminate command.`);

					break;
				}

			    await interaction.editReply("Terminating...");

				//log out of Discord
				interaction.client.destroy();

			    log.info(`Bot is being terminated by ${interaction.user.tag}.`);

				//exit program
        	    process.exit(0);
			}
		}
	},
};
