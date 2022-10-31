//libraries
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { announcerRoleId } = require('../configuration/otherIDs.json');
const { announcementEmbedColor } = require('../configuration/embedColors.json');
const log = require('../logger.js');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Creates an announcement.')
        .setDMPermission(false)
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
        if (interaction.member.roles.cache.some(role => role.id === announcerRoleId)) {
            //get all of the options
            let title = interaction.options.getString('title');
            const announcement = interaction.options.getString('announcement');
            const ping = interaction.options.getMentionable('ping');
            const channel = interaction.options.getChannel('channel');
            
            //make the announcement
            //if user didn't specify title set default title
            if (title === null) title = 'New Announcement!';

            //create the embed
            const embed = new EmbedBuilder()
                .setColor(announcementEmbedColor)
                .setTitle(title)
                .setDescription(announcement);
        
            //create the message depending on the ping state
            let message = null;
            if(ping !== null){
                message = `New Announcement by ${await interaction.client.functions.get('userDB').getTitle(interaction.user.id)} ${interaction.user.username}, ${ping}.`;
            } else{
                message = `New Announcement by ${await interaction.client.functions.get('userDB').getTitle(interaction.user.id)} ${interaction.user.username}.`;
            }

            //send the message to the channel
            channel.send({content: message, embeds: [embed]}).then(sent => {
                if(channel.type === ChannelType.GuildAnnouncement) sent.crosspost();
            });
            
            //give confirmation to the user that the command was successful
            await interaction.editReply({content: 'Your announcement has been sent and published.', ephemeral: true});
            log.info(`${interaction.user.tag} made an anouncement.`);
        } else{
            //give error if user does not have permissions
            await interaction.editReply({content: 'You do not have permissions to run this command.', ephemeral: true});
            log.warn(`${interaction.user.tag} attempted to run "/announce".`);
            return;
        }
    }
};
