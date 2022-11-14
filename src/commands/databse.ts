//libraries
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import functions from "../functions/_functionList";
import log from "../logger";

//command information
module.exports = {
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
        const userDB:any = functions.get("userDB");
        const dbEntry = await userDB.read(interaction.user.id);

        switch(interaction.options.getSubcommand()){
            case "create":{
                //create the users database entry
			    const success = userDB.create(interaction.user.id);

                //tell the user if the action was successful or not
                if(success == 1){
                    await interaction.editReply("Your database profile already exists.");
                } else{
                    await interaction.editReply("Your database profile has been created.");
                }

			    //end command execution
			    break;
            }

            case "view":{
                
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
			    break;
            }
        }
    }
}   
