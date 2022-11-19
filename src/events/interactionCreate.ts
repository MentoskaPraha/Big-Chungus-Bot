//libraries
import { Interaction, Events } from "discord.js";
import { commandObject } from "../types";
import commands from "../commands/_commandList";
import log from "../logger";

export = {
	name: Events.InteractionCreate,
	once: false,

	//code to run when an interaction is recieved
	async execute(interaction:Interaction) {
        //if the interaction is a command run the following code and return
	    if (interaction.isCommand()){
	        //get the command name
	        const command = commands.get(interaction.commandName) as commandObject;

	        //if the command does not exist return
	        if (!command){
                await interaction.reply({content: "Could not find command in database, please contact MentoskaPraha immediately!", ephemeral: true});
                log.error(`${interaction.user.tag} has run an unknown command!`);
                return;
            } 

            //run the commands code
	        try {
                await interaction.deferReply({ephemeral: command.ephemeral});
		        await command.execute(interaction);
	        } catch (error) {
		        await interaction.editReply("There was an error while executing this command.");
                log.error(`${interaction.user.tag} experienced an error while running a command.`);
	        }

            //prevent other code from being run
            return;
        }
	}
};
