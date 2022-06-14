//libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { announcerRole, announcementEmbedColor } = require('../config.json');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Allows you to create an announcement.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the announcement.')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('announcement')
                .setDescription('The announcement itself.')
                .setRequired(true)
            )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select which channel the announcement will be sent into.')
                .setRequired(true)
            )
        .addBooleanOption(option =>
            option.setName('ping')
                .setDescription('Whether to ping the role/person selected in the mention option.')
                .setRequired(true)
            )
        .addMentionableOption(option =>
            option.setName('mention')
                .setDescription('The role/person that will be pinged. Only works if ping is true.')
                .setRequired(true)
            ),
        
    //when command is called run the following
    async execute(interaction){
        //check if user has permissions to make the announcement
        if (interaction.member.roles.cache.some(role => role.name === announcerRole)) {
            //defer the reply
            await interaction.deferReply({ephemeral: true});

            //get all of the options
            const title = interaction.options.getString('title');
            const announcemnt = interaction.options.getString('announcement');
            const ping = interaction.options.getBoolean('ping');
            const mention = interaction.options.getMentionable('mention');
            const channel = interaction.options.getChannel('channel');
            
            //create the embed
            const embed = new MessageEmbed()
                .setColor(announcementEmbedColor)
                .setTitle(title)
                .setDescription(announcemnt)
            
            //send the embed into the selected channel and ping if option is set to true
            if(ping){
                channel.send({content: `New Announcement by ${interaction.user.tag}, ${mention}.`, embeds: [embed] });
            } else{
                channel.send({content: `New Announcement by ${interaction.user.tag}.`, embeds: [embed] });
            }
            
            //give confirmation to the user that the command was successful
            await interaction.editReply({content: 'Your announcement has been sent.\nYou will need to publish it manually if it was sent in an announcement channel, this is for security reasons.', ephemeral: true});
            console.log(`${interaction.user.tag} made an anouncement.`);
            return;
                
        } else{
            //give error if user does not have permissions
            await interaction.reply({content: 'You do not have permissions to run this command.', ephemeral: true});
            console.log(`${interaction.user.tag} attempted to run "/announce".`);
            return;
        }
    }
};
