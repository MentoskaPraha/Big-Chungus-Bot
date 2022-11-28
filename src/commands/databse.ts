//dependancies
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { userDBEntry, userDBFuncs } from "../types";
import functions from "../functions/_functionList";
import log from "../logger";

//command
export = {
    name: "database",
    ephemeral: true,

	//command information
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
        
    //command code
    async execute(interaction:CommandInteraction){
		if(!interaction.isChatInputCommand()) return;

        //get userDB entry
        const userDB = functions.get("userDB") as userDBFuncs;
        const potentialDBEntry = await userDB.read(interaction.user.id);

        switch(interaction.options.getSubcommand()){
            case "create":{
                //create the users database entry
			    const success = await userDB.create(interaction.user.id);

                //tell the user if the action was successful or not
                if(success == false){
                    await interaction.editReply("Your database profile already exists.");
                    log.info(`${interaction.user.id} has failed to create their database entry.`);
			        break;
                } else{
                    await interaction.editReply("Your database profile has been created.");
                    log.info(`${interaction.user.id} has created their database entry.`);
			        break;
                }
            }

            case "view":{
                //check if user has a DB entry
                if(potentialDBEntry == false){
                    await interaction.editReply("You do not have a database entry!");
                    log.warn(`${interaction.user.tag} failed to view their userDB entry.`);
                    break;
                }

                //get the DB entry
                const dbEntry = potentialDBEntry as userDBEntry;

                //give user his DB entry info
                await interaction.editReply(`**Your Database Information**\nId: ${dbEntry.id}\nTitle: ${dbEntry.title}\nColor: ${dbEntry.color}\nColor Role Id: ${dbEntry.colorRoleId}`);

                log.info(`${interaction.user.tag} viewed their database entry.`);
                break;
            }

            case "delete":{
                //delete the users database entry
                const success = await userDB.delete(interaction.user.id);
 
                //tell the user if the action was successful or not
                if(success == false){
                    await interaction.editReply("Your database profile does not exist.");
                    log.info(`${interaction.user.id} has failed to delete their database entry.`);
			        break;
                } else{
                    await interaction.editReply("Your database profile has been deleted.");
                    log.info(`${interaction.user.id} has deleted their database entry.`);
			        break;
                }
            }
        }
    }
}   
