
const { ChannelType } = require('discord.js');
const { eventAnnouncementChannelId } = require('../configuration/otherIDs.json');
const log = require('../logger.js');

module.exports = {
    name: 'guildScheduledEventDelete',

    //run the following code when a Guild Scheduled Event is edited
    async execute(event){
        //create a message that will be sent
        const message = `**An Event has been canceled!**\nSorry for any inconveniences caused!\n${event.url}`;

        //get the channel the message will be sent into
        const channel = event.guild.channels.cache.get(eventAnnouncementChannelId);

        //send the message into that channel
        channel.send({content: message}).then(sent => {
            //if(channel.type === ChannelType.GuildAnnouncement) sent.crosspost();
        });

        //log the action to the console
        log.info('Guild scheduled event cancelation has been announced!');
    }
};
