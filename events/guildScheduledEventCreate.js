const { eventAnnouncementChannelId, guildId } = require('../configuration/config.json');

module.exports = {
    name: 'guildScheduledEventCreate',
    //when a new event is created run the following code
    async execute(guildScheduledEvent){
        //create announcement message
        var message = `**New Event!**\nhttps://discord.com/events/${guildId}/${guildScheduledEvent.id}`;

        //get the event announcement channel
        const channel = guildScheduledEvent.client.guilds.cache.get(guildId).channels.cache.get(eventAnnouncementChannelId);

        //send the announcement message and publish it
        channel.send(message).then(sent => {
            sent.crosspost();
        });

        //log the event to the console
        console.log(`New event has been scheduled and announced.`);
    }
};
