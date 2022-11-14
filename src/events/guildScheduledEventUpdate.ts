//libraries
import { GuildScheduledEvent, GuildScheduledEventStatus, TextChannel } from "discord.js";
import log from "../logger";
const { eventAnnouncementChannelId } = require("../configuration/otherIDs.json");

export = {
    name: "guildScheduledEventUpdate",

    //run the following code when a Guild Scheduled Event is edited
    async execute(oldEvent:GuildScheduledEvent, newEvent:GuildScheduledEvent){
        //check if the event went from scheduled to active
        if(oldEvent.status == GuildScheduledEventStatus.Scheduled && newEvent.status === GuildScheduledEventStatus.Active){
            //create a message that will be sent
            const message = `**An Event is now ongoing!**\nYou may now join the VC!\n${newEvent.url}`;

            //get the channel the message will be sent into
            const channel = newEvent.guild?.channels.cache.find(channel => channel.id == eventAnnouncementChannelId) as TextChannel;

            //send the message into that channel
            channel.send({content: message}).then((sent:any) => {
                try {
                    sent.crosspost();
                } catch (error) {
                    log.warn("Announcement was sent into non-announcement channel. Crosspost failed.")
                }
            });

            //log the action to the console
            log.info("Guild scheduled event activation has been announced!");

            //end code execution
            return;
        }

        //check if the event went from active to completed
        if(oldEvent.status == GuildScheduledEventStatus.Active && newEvent.status === GuildScheduledEventStatus.Completed){
            //create a message that will be sent
            const message = `**An Event has concluded!**\nThank you for coming!\n${newEvent.url}`;

            //get the channel the message will be sent into
            const channel = newEvent.guild?.channels.cache.find(channel => channel.id == eventAnnouncementChannelId) as TextChannel;

            //send the message into that channel
            channel.send({content: message}).then((sent:any) => {
                try {
                    sent.crosspost();
                } catch (error) {
                    log.warn("Announcement was sent into non-announcement channel. Crosspost failed.")
                }
            });

            //log the action to the console
            log.info("Guild scheduled event completion has been announced!");

            //end code execution
            return;
        }

        //check if the event went from scheduled to canceled
        if(oldEvent.status == GuildScheduledEventStatus.Scheduled && newEvent.status === GuildScheduledEventStatus.Canceled){
            //create a message that will be sent
            const message = `**An Event has been canceled!**\nSorry for any inconveniences caused!\n${newEvent.url}`;

            //get the channel the message will be sent into
            const channel = newEvent.guild?.channels.cache.find(channel => channel.id == eventAnnouncementChannelId) as TextChannel;

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

            //end code execution
            return;
        }
    }
};
