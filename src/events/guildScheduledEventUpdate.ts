//dependancies
import { Events, GuildScheduledEvent } from "discord.js";
import { getGuildEventAnnounce } from "$lib/databaseAPI";
import log from "$lib/logger";
import { announceEvent } from "$lib/utilities";
import { processCountChange } from "$lib/appState";

export = {
	name: Events.GuildScheduledEventUpdate,
	once: false,

	async execute(
		oldEvent: GuildScheduledEvent,
		newEvent: GuildScheduledEvent
	) {
		processCountChange(true);
		const channelId = await getGuildEventAnnounce(newEvent.guildId);
		if (channelId == null) {
			processCountChange(false);
			return;
		}

		let message: string;

		if (oldEvent.isScheduled() && newEvent.isActive()) {
			message = `**An Event has Begun!**\n${newEvent.url}`;
		} else {
			if (oldEvent.isActive() && newEvent.isCompleted()) {
				message = `**An Event has Ended!**\n${newEvent.url}`;
			} else {
				message = `**An Event has been Updated!**\n${newEvent.url}`;
			}
		}

		await announceEvent(channelId, newEvent, message);

		log.info(
			`Announced update/start of a Guild Scheduled Event in ${newEvent.guild?.name}`
		);

		processCountChange(false);
	}
};
