//libraries
const { SlashCommandBuilder } = require('discord.js');
const log = require('../logger.js');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('color')
		.setDescription('Use this command to set your own custom color.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('create')
                .setDescription('Create your color.')
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color you wish to have. Must be a valid HEX code without the starting #.')
                        .setRequired(true)
                    )
            )
        .addSubcommand(subcommand =>
            subcommand.setName('edit')
                .setDescription('Edit your color.')
                .addStringOption(option =>
                    option.setName('new_color')
                        .setDescription('The color you wish to have. Must be a valid HEX code without the starting #.')
                        .setRequired(true)
                    )
            )
        .addSubcommand(subcommand =>
            subcommand.setName('delete')
                .setDescription('Deletes your color.')
            ),
        
    //when command is called run the following
    async execute(interaction){
        
    }
}   
