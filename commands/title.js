//libraries
const { SlashCommandBuilder } = require('discord.js');
const log = require('../logger.js');

//command information
module.exports = {
    //build the command
    data: new SlashCommandBuilder()
        .setName('title')
        .setDescription('Set your title that will be infront of your name when the bot references you.')
        .setDMPermission(true)
        .addSubcommand(subcommand =>
            subcommand.setName('change')
                .setDescription('Change your title.')
                .addStringOption(option =>
                    option.setName('new_title')
                        .setDescription('The title you wish to have.')
                        .setRequired(true)
                        .setMaxLength(10)
                    )
            )
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Removes your title.')
        ),

    //when the command is called run the following
    async execute(interaction){
        //if the user requested to change their title run the following
        if(interaction.options.getSubcommand() === 'change'){
            //get the title
            const newTitle = interaction.options.getString('new_title');

            //update the title in the userDB
            await interaction.client.functions.get('userDB').edit(interaction.user.id, newTitle, null, null, null);

            //respond to the user
            interaction.editReply({content: 'Your title was successfully changed!', ephemeral: true});
            log.info(`${interaction.user.tag} has successfully changed their title.`);

            //end code
            return;
        }

        //if the user requested to delete their title run the following
        if(interaction.options.getSubcommand() === 'remove'){
            //get the title
            const newTitle = 'Titleless';

            //update the title in the userDB
            await interaction.client.functions.get('userDB').edit(interaction.user.id, newTitle, null, null, null);

            //respond to the user
            interaction.editReply({content: 'Your title was successfully removed!', ephemeral: true});
            log.info(`${interaction.user.tag} has successfully removed their title.`);

            //end code
            return;
        }
    }
};
