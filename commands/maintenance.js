//libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const { maintianerId } = require('../config.json');

//command information
module.exports = {
	//build command
	data: new SlashCommandBuilder()
		.setName('maintenance')
		.setDescription('Commands related to maintaning the bot.')
        .addSubcommand(subcommand =>
            subcommand.setName('ping')
                .setDescription('Returns the latency of the bot.')
            )
        .addSubcommand(subcommand =>
            subcommand.setName('terminate')
                .setDescription('Terminates the bot.')
            ),
	
	//run this code if the command is called
	async execute(interaction) {
		//check if the user can terminate the bot
		if(interaction.user.id === maintianerId){
            //if the subcommand is terminate run the following
            if (interaction.options.getSubcommand() === 'terminate'){
                //tell the user that the bot is being terminated
			    await interaction.reply({content: 'Terminating...', ephemeral: true});

                //log the termination to the console
			    console.log(`Bot is being terminated by ${interaction.user.tag}.`);

                //terminate the bot
        	    process.exit(0);  
            }
		} else{
			//respond if error message if user does not have termination permission
			await interaction.reply({content: 'You do not have permissions to run this command.', ephemeral: true});
            
            //log action
			console.log(`${interaction.user.tag} attempted to access maintinence commands.`);
		}
	},
};
