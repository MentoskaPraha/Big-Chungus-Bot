//libraries
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import functions from "../functions/_functionList";
import log from "../logger";

//command information
export = {
    //build the command
    data: new SlashCommandBuilder()
        .setName("title")
        .setDescription("Set your title that will be infront of your name when the bot references you.")
        .setDMPermission(true)
        .addSubcommand(subcommand =>
            subcommand.setName("update")
                .setDescription('Change your title.')
                .addStringOption(option =>
                    option.setName("new_title")
                        .setDescription("The title you wish to have.")
                        .setRequired(true)
                        .setMaxLength(10)
                    )
            )
        .addSubcommand(subcommand => 
            subcommand.setName("view")
                .setDescription("View your title.")
            )
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("Removes your title.")
        ),

    //when the command is called run the following
    async execute(interaction:CommandInteraction){
        //check if the command is a slash command
		if(!interaction.isChatInputCommand()) return;

        //get userDb interface
        const userDB:any = functions.get("userDB");

        switch(interaction.options.getSubcommand()){
            case "update": {
                //get the title
                const newTitle = interaction.options.getString('new_title');

                //update the title in the userDB
                await userDB.edit(interaction.user.id, newTitle, null, null, null);

                //respond to the user
                await interaction.editReply('Your title was successfully changed!');
                log.info(`${interaction.user.tag} has successfully changed their title.`);

                //end code
                break;
            }

            case "view":{
                //give user their title
                await interaction.editReply(`Your title is: ${userDB.getTitle(interaction.user.id)}.`);
                log.info(`${interaction.user.tag} has requested their title.`);

                //end code
                break;
            }

            case "remove":{
                //update the title in the userDB
                await userDB.edit(interaction.user.id, "Titleless", null, null, null);

                //respond to the user
                await interaction.editReply("Your title was successfully removed!");
                log.info(`${interaction.user.tag} has successfully removed their title.`);

                //end code
                break;
            }
        }
    }
};
