//libraries
import { GuildScheduledEvent, TextChannel } from "discord.js";
const { eventAnnouncementChannelId } = require('../configuration/otherIDs.json');
import log from "../logger";

export = {
    name: 'guildScheduledEventDelete',

    //run the following code when a Guild Scheduled Event is edited
    async execute(event:GuildScheduledEvent){
        //create a message that will be sent
        const message = `**An Event has been canceled!**\nSorry for any inconveniences caused!\n${event.url}`;

        //get the channel the message will be sent into
        const channel = event.guild?.channels.cache.find(channel => channel.id == eventAnnouncementChannelId) as TextChannel;

        //send the message into that channel
        channel.send({content: message}).then((sent:any) => {
            try {
                sent.crosspost();
            } catch (error) {
                log.warn("Announcement was sent into non-announcement channel. Crosspost failed.")
            }
        });

        //log the action to the console
        log.info("Guild scheduled event cancelation has been announced!");
    }
};
