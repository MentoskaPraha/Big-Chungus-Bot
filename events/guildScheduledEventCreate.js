const { eventAnnouncementChannelId } = require('../configuration/config.json');
const log = require('../logger.js');

module.exports = {
    name: 'guildScheduledEventCreate',
    //when a new event is created run the following code
    async execute(guildScheduledEvent){
        //create announcement message
        const message = `**New Event!**\nhttps://discord.com/events/${guildScheduledEvent.guild.id}/${guildScheduledEvent.id}`;

        //get the event announcement channel
        const channel = guildScheduledEvent.guild.channels.fetch(eventAnnouncementChannelId);

        //send the announcement message and publish it
        channel.send(message).then(sent => {
            sent.crosspost();
        });

        //log the event to the console
        log.info(`New event has been scheduled and announced in a guild(${guildScheduledEvent.guild.id}).`);
    }
};
