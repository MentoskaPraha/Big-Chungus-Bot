//dependancies
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import functions from "../functions/_functionList";
import log from "../logger";
import { userDBFuncs } from "../types";

//command
export = {
    name: "title",
    ephemeral: true,

    //command data
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

    //command code
    async execute(interaction:CommandInteraction){
		if(!interaction.isChatInputCommand()) return;

        //get userDB funcs
        const userDB = functions.get("userDB") as userDBFuncs;

        switch(interaction.options.getSubcommand()){
            case "update": {
                //get command options
                const newTitle = interaction.options.getString('new_title');

                //update the title in the userDB
                await userDB.edit(interaction.user.id, newTitle, null, null);

                //respond to the user
                await interaction.editReply('Your title was successfully changed!');
                log.info(`${interaction.user.tag} has successfully changed their title.`);

                break;
            }

            case "view":{
                //respond with user's title
                await interaction.editReply(`Your title is: ${await userDB.getTitle(interaction.user.id)}`);
                log.info(`${interaction.user.tag} has requested their title.`);

                break;
            }

            case "remove":{
                //update the title in the userDB
                await userDB.edit(interaction.user.id, "Titleless", null, null);

                //respond to the user
                await interaction.editReply("Your title was successfully removed!");
                log.info(`${interaction.user.tag} has successfully removed their title.`);

                break;
            }
        }
    }
};
