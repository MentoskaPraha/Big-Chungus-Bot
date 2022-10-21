//libraries
const { SlashCommandBuilder } = require('discord.js');
const { maintianerId } = require('../configuration/otherIDs.json');
const log = require('../logger.js');

//command information
module.exports = {
	//build command
	data: new SlashCommandBuilder()
		.setName('maintenance')
		.setDescription('Commands related to maintaning the bot.')
		.setDMPermission(true)
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
		//if the command is the ping command run the following
		if(interaction.options.getSubcommand() === 'ping'){
			//get latency
			const apiLatency = Math.round(interaction.client.ws.ping);
			const botLatency = Math.floor(Math.abs(Date.now() - interaction.createdAt));

			//respond to the user
			await interaction.reply(`**Current Latency**\nAPI Latency is around ${apiLatency}ms.\nBot Latency is around ${botLatency}ms.`);

			//log it to the command console
			log.info(`API Latency is around ${apiLatency}ms. Bot Latency is around ${botLatency}ms.`);

			//end command execution
			return;
		}

		//check if the user can use maintinence commands
		if(interaction.user.id === maintianerId){
            //if the subcommand is terminate run the following
            if (interaction.options.getSubcommand() === 'terminate'){
                //tell the user that the bot is being terminated
			    await interaction.reply({content: 'Terminating...', ephemeral: true});

                //log the termination to the console
			    log.info(`Bot is being terminated by ${interaction.user.tag}.`);

                //terminate the bot
        	    process.exit(0);  
            }
		} else{
			//respond if error message if user does not have termination permission
			await interaction.reply({content: 'You do not have permissions to run this command.', ephemeral: true});
            
            //log action
			log.warn(`${interaction.user.tag} attempted to access maintenance commands.`);
		}
	},
};
