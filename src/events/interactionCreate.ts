//dependancies
import { Interaction, Events } from "discord.js";
import { commandObject } from "../types";
import commands from "../commands/_commandList";
import log from "../logger";

export = {
	name: Events.InteractionCreate,
	once: false,

	async execute(interaction:Interaction) {
        //command interaction handling
	    if (interaction.isCommand()){
	        const command = commands.get(interaction.commandName) as commandObject;

	        //check if the command exists
	        if (!command){
                await interaction.reply({content: "Could not find command, please contact MentoskaPraha immediately!", ephemeral: true});
                log.error(`${interaction.user.tag} has run an unknown command!`);
                return;
            } 

            //run the command
	        try {
                await interaction.deferReply({ephemeral: command.ephemeral});
		        command.execute(interaction).catch(async (error) => {
					log.error(`${interaction.user.tag} experienced an error while running a command. Error: ${error}`);
					await interaction.editReply("There was an error while executing this command.");
				});
	        } catch (error) {
		        await interaction.editReply("There was an error while executing this command.");
                log.error(`${interaction.user.tag} experienced an error while running a command. Error: ${error}`);
	        }

            return;
        }
	}
};
