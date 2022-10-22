
const { ChannelType, GuildScheduledEventStatus } = require('discord.js');
const { eventAnnouncementChannelId } = require('../configuration/otherIDs.json');
const log = require('../logger.js');

module.exports = {
    name: 'guildScheduledEventUpdate',

    //run the following code when a Guild Scheduled Event is edited
    async execute(oldEvent, newEvent){
        //check if the event went from scheduled to active
        if(oldEvent.status === GuildScheduledEventStatus.Scheduled && newEvent.status === GuildScheduledEventStatus.Active){
            //create a message that will be sent
            const message = `**An Event is now ongoing!**\nYou may now join the VC!\n${newEvent.url}`;

            //get the channel the message will be sent into
            const channel = newEvent.guild.channels.cache.get(eventAnnouncementChannelId);

            //send the message into that channel
            channel.send({content: message}).then(sent => {
               //if(channel.type === ChannelType.GuildAnnouncement) sent.crosspost();
            });

            //log the action to the console
            log.info('Guild scheduled event activation has been announced!');

            //end code execution
            return;
        }

        //check if the event went from active to completed
        if(oldEvent.status === GuildScheduledEventStatus.Active && newEvent.status === GuildScheduledEventStatus.Completed){
            //create a message that will be sent
            const message = `**An Event has concluded!**\nThank you for coming!\n${newEvent.url}`;

            //get the channel the message will be sent into
            const channel = newEvent.guild.channels.cache.get(eventAnnouncementChannelId);

            //send the message into that channel
            channel.send({content: message}).then(sent => {
               //if(channel.type === ChannelType.GuildAnnouncement) sent.crosspost();
            });

            //log the action to the console
            log.info('Guild scheduled event completion has been announced!');

            //end code execution
            return;
        }

        //check if the event went from scheduled to canceled
        if(oldEvent.status === GuildScheduledEventStatus.Scheduled && newEvent.status === GuildScheduledEventStatus.Canceled){
            //create a message that will be sent
            const message = `**An Event has been canceled!**\nSorry for any inconveniences caused!\n${newEvent.url}`;

            //get the channel the message will be sent into
            const channel = newEvent.guild.channels.cache.get(eventAnnouncementChannelId);

            //send the message into that channel
            channel.send({content: message}).then(sent => {
               //if(channel.type === ChannelType.GuildAnnouncement) sent.crosspost();
            });

            //log the action to the console
            log.info('Guild scheduled event cancelation has been announced!');

            //end code execution
            return;
        }
    }
};
