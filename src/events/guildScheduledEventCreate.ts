//libraries
import { GuildScheduledEvent, TextChannel } from "discord.js";
import log from "../logger";
const { eventAnnouncementChannelId } = require("../configuration/otherIDs.json");

export = {
    name: "guildScheduledEventCreate",

    //run the following code when a Guild Scheduled Event is created
    async execute(event:GuildScheduledEvent){
        //create a message that will be sent
        const message = `**An Event has been scheduled!**\nHope to see you there!\n${event.url}`;

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
        log.info('New guild scheduled event has been announced!');
    }
};
