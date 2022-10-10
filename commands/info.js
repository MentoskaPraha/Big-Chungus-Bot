//libraries
const { SlashCommandBuilder, time } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { userInfoEmbedColor, serverInfoEmbedColor } = require('../configuration/embedColors.json');
const log = require('../logger.js');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Gives information about something')
		.addSubcommand(subcommand =>
			subcommand.setName('user')
				.setDescription('Get information about a user.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user you want information about.')
						.setRequired(true)
					)
			)
		.addSubcommand(subcommand =>
			subcommand.setName('server')
				.setDescription('Get information about this server.')
			),
    
    //when command is called run the following
    async execute(interaction){
		//if the command user is run do the following
		if (interaction.options.getSubcommand() === 'user') {
			//get user input
            const user = interaction.options.getUser('user');

			//create information
			var userInfo = `Username: ${user.username}\nTag: ${user.tag}\nUser ID: ${user.id}\nIs User a Bot: ${user.bot}\nUser joined Discord: <t:${Math.floor(user.createdTimestamp / 1000)}:D>`;

			//create response message
			const embed = new MessageEmbed()
				.setColor(userInfoEmbedColor)
				.setDescription(userInfo)
				.setTitle(`Information about ${user.username}`)
				.setThumbnail(user.displayAvatarURL())

			//send response
			await interaction.reply({embeds: [embed]});

			//log that command was run
			log.info(`${interaction.user.tag} requested information about ${user.tag}.`);

			//prevent unecessery checks
			return;
        }

		//if the command server is run do the following
		if (interaction.options.getSubcommand() === 'server'){
			//create information
			var serverInfo = `Server Name: ${interaction.guild.name}\nServer Id: ${interaction.guild.id}\nMember Count: ${interaction.guild.memberCount}\nServer Created: <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:D>`;

			//create response message
			const embed = new MessageEmbed()
				.setColor(serverInfoEmbedColor)
				.setDescription(serverInfo)
				.setTitle(`Information about ${interaction.guild.name}`)
				.setThumbnail(interaction.guild.iconURL())

			//send response
			await interaction.reply({embeds: [embed]});

			//log that command was run
			log.info(`${interaction.user.tag} requested information about ${interaction.guild.name}.`);

			//prevent unecessery checks
			return;
        }
		
    }
};
