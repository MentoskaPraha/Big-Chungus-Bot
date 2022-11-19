//libraries
import { ChannelType, Events, GuildScheduledEvent, GuildTextBasedChannel } from "discord.js";
const { eventAnnouncementChannelId } = require("../configuration/otherIDs.json");
import log from "../logger";

export = {
    name: Events.GuildScheduledEventDelete,
	once: false,

    //run the following code when a Guild Scheduled Event is edited
    async execute(event:GuildScheduledEvent){
        //create a message that will be sent
        const message = `**An Event has been canceled!**\nSorry for any inconveniences caused!\n${event.url}`;

        //get the channel the message will be sent into
        const channel = event.guild?.channels.cache.find(channel => channel.id == eventAnnouncementChannelId) as GuildTextBasedChannel;

        //send the message into that channel
        channel.send({content: message}).then(sent => {
            if(channel.type == ChannelType.GuildAnnouncement){
                sent.crosspost();
            }
        });

        //log the action to the console
        log.info("Guild scheduled event cancelation has been announced!");
    }
};
