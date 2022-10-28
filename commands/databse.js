//libraries
const { SlashCommandBuilder } = require('discord.js');
const log = require('../logger.js');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('Use this command to interface with the database.')
        .setDMPermission(true)
        .addSubcommand(subcommand =>
            subcommand.setName('create')
                .setDescription('Saves your profile in the database.')
            )
        .addSubcommand(subcommand =>
            subcommand.setName('delete')
                .setDescription('Deletes your profile from the database.')
            ),
        
    //when command is called run the following
    async execute(interaction){
        if(interaction.options.getSubcommand() === 'create'){
            //create the users database entry
			const success = interaction.client.functions.get('userDB').create(interaction.user.id);

            //tell the user if the action was successful or not
            if(success === 1){
                await interaction.editReply({content: 'Your database profile already exists.', ephemeral: true});
            } else{
                await interaction.editReply({content: 'Your database profile has been created.', ephemeral: true});
            }

			//end command execution
			return;
		}

        if(interaction.options.getSubcommand() === 'delete'){
            //create the users database entry
            const success = await interaction.client.functions.get('userDB').delete(interaction.user.id);
 
            //tell the user if the action was successful or not
            if(success === 1){
                await interaction.editReply({content: 'Your database profile does not exist.', ephemeral: true});
            } else{
                await interaction.editReply({content: 'Your database profile has been deleted.', ephemeral: true});
            } 

			//end command execution
			return;
		}
    }
}   
