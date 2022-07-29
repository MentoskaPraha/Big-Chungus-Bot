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
            option.setName('announcement')
                .setDescription('The announcement itself.')
                .setRequired(true)
            )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel the announcement will be sent to.')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the announcement.')
                .setRequired(false)
            )    
        .addMentionableOption(option =>
            option.setName('ping')
                .setDescription('The role/person that will be pinged.')
                .setRequired(false)
            ),
        
    //when command is called run the following
    async execute(interaction){
        //check if user has permissions to make the announcement
        if (interaction.member.roles.cache.some(role => role.id === announcerRole)) {
            //defer the reply
            await interaction.deferReply({ephemeral: true});

            //get all of the options
            const title = interaction.options.getString('title');
            const announcemnt = interaction.options.getString('announcement');
            const ping = interaction.options.getMentionable('ping');
            const channel = interaction.options.getChannel('channel');
            
            //if user didn't specify title set default title
            if (title === null) title = 'New Announcement!'

            //create the embed
            const embed = new MessageEmbed()
                .setColor(announcementEmbedColor)
                .setTitle(title)
                .setDescription(announcemnt)
            
            //send the embed into the selected channel and ping if option is set to true
            if(ping !== null){
                channel.send({content: `New Announcement by ${interaction.member.username}, ${ping}.`, embeds: [embed] });
            } else{
                channel.send({content: `New Announcement by ${interaction.member.username}.`, embeds: [embed] });
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
