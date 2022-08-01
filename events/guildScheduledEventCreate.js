const { MessageEmbed } = require('discord.js');
const { eventAnnouncementEmbedColor, eventAnnouncementChannelId, guildId } = require('../configuration/config.json');

module.exports = {
    name: 'guildScheduledEventCreate',
    //when a new event is created run the following code
    async execute(guildScheduledEvent){
        //create the message
        var message = `${guildScheduledEvent.creator.username} has created a new event!\n
        https://discord.com/event/${guildId}/${guildScheduledEvent.id}`;

        //create embed description
        var description = `New event scheduled by ${guildScheduledEvent.creator.username}!\n\nYou can find more information about this event bellow.\n\n`;
        if(guildScheduledEvent.description !== null){
            description += guildScheduledEvent.description;
        } else{
            description += 'This event has no description.';
        }

        //create the embed
        var embed = new MessageEmbed()
            .setColor(eventAnnouncementEmbedColor)
            .setTitle(guildScheduledEvent.name)
            .setDescription(description)
            .setThumbnail(guildScheduledEvent.image)
            .setTimestamp(guildScheduledEvent.scheduled_start_time)

        //get the event announcement channel
        const channel = client.guilds.cache.get(guildId).channels.get(eventAnnouncementChannelId);

        //send the announcement message
        channel.send({content: message, embeds: embed});

        //log the event to the console
        console.log(`${guildScheduledEvent.user.tag} has scheduled a new event.`);
    }
};
