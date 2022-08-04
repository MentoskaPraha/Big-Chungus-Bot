//libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { announcerRole, announcementEmbedColor } = require('../configuration/config.json');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Creates an announcement.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel the announcement will be sent to.')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('announcement')
                .setDescription('The announcement itself.')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the announcement.')
                .setRequired(false)
            )    
        .addMentionableOption(option =>
            option.setName('ping')
                .setDescription('The role/person that will be pinged, leave blank to not ping anyone.')
                .setRequired(false)
            ),
        
    //when command is called run the following
    async execute(interaction){
        //check if user has permissions to make the announcement
        if (interaction.member.roles.cache.some(role => role.id === announcerRole)) {
            //defer the reply
            await interaction.deferReply({ephemeral: true});

            //get all of the options
            var title = interaction.options.getString('title');
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
            
            //create the message depending on the ping state
            var message = null;
            if(ping !== null){
                message = `New Announcement by ${interaction.user.username}, ${ping}.`;
            } else{
                message = `New Announcement by ${interaction.user.username}.`;
            }

            //send the message to the channel
            channel.send({content: message, embeds: [embed]}).then(sent => {
                if(channel.type === 'GuildNews') sent.crosspost();
            });
            
            //give confirmation to the user that the command was successful
            await interaction.editReply({content: 'Your announcement has been sent and published.', ephemeral: true});
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
