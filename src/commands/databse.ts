//libraries
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { userDBEntry, userDBFuncs } from "../types";
import functions from "../functions/_functionList";
import log from "../logger";

//command information
export = {
    name: "database",
    ephemeral: true,

	//build the command
	data: new SlashCommandBuilder()
		.setName("database")
		.setDescription("Use this command to interface with the database.")
        .setDMPermission(true)
        .addSubcommand(subcommand =>
            subcommand.setName("create")
                .setDescription("Registers your profile in the database.")
            )
        .addSubcommand(subcommand =>
            subcommand.setName("view")
                .setDescription("View your database information.")
            )
        .addSubcommand(subcommand =>
            subcommand.setName("delete")
                .setDescription("Deletes your profile from the database.")
            ),
        
    //when command is called run the following
    async execute(interaction:CommandInteraction){
        //check if the command is a slash command
		if(!interaction.isChatInputCommand()) return;

        //get the database entry on the user
        const userDB = functions.get("userDB") as userDBFuncs;
        const potentialDBEntry = await userDB.read(interaction.user.id);

        switch(interaction.options.getSubcommand()){
            case "create":{
                //create the users database entry
			    const success = await userDB.create(interaction.user.id);

                //tell the user if the action was successful or not
                if(success == 1){
                    await interaction.editReply("Your database profile already exists.");
                } else{
                    await interaction.editReply("Your database profile has been created.");
                }

			    //end command execution
                log.info(`${interaction.user.id} has created their database entry.`);
			    break;
            }

            case "view":{
                //check if user has a DB entry
                if(potentialDBEntry == 1){
                    await interaction.editReply("You do not have a database entry!");
                    log.warn(`${interaction.user.tag} tried to view his database entry, but he didn't have one.`);
                    break
                }
                const dbEntry = potentialDBEntry as userDBEntry;

                //give user his DB entry info
                await interaction.editReply(`**Your Database Information**\nId: ${dbEntry.id}\nTitle: ${dbEntry.title}\nColor: ${dbEntry.color}\nColor Role Id: ${dbEntry.colorRoleId}`);
                log.info(`${interaction.user.tag} viewed his database entry.`);
                break;
            }

            case "delete":{
                //create the users database entry
                const success = await userDB.delete(interaction.user.id);
 
                //tell the user if the action was successful or not
                if(success == 1){
                    await interaction.editReply("Your database profile does not exist.");
                } else{
                    await interaction.editReply("Your database profile has been deleted.");
                } 

			    //end command execution
                log.info(`${interaction.user.id} has deleted their database entry.`);
			    break;
            }
        }
    }
}   
