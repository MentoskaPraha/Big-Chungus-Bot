//libraries
const { EmbedBuilder, ChannelType } = require('discord.js');
const { announcementEmbedColor } = require('../configuration/embedColors.json');

//function code
module.exports = {
    name: 'sendAnnouncement',
    execute (title, announcement, ping, channel, user, crosspost) {
        //if user didn't specify title set default title
        if (title === null) title = 'New Announcement!';

        //create the embed
        const embed = new EmbedBuilder()
            .setColor(announcementEmbedColor)
            .setTitle(title)
            .setDescription(announcement);
        
        //create the message depending on the ping state
        var message = null;
        if(ping !== null){
            message = `New Announcement by ${user.username}, ${ping}.`;
        } else{
            message = `New Announcement by ${user.username}.`;
        }

        //send the message to the channel
        channel.send({content: message, embeds: [embed]}).then(sent => {
            if(channel.type === ChannelType.GuildAnnouncement) sent.crosspost();
        });
    }
};
