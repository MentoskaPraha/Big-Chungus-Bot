//dependancies
import { Events, GuildScheduledEvent } from "discord.js";
import { getGuildEventAnnounce } from "$lib/databaseAPI";
import log from "$lib/logger";
import { announceEvent } from "$lib/utilities";
import { processCountChange } from "$lib/appState";

export = {
	name: Events.GuildScheduledEventCreate,
	once: false,

	async execute(event: GuildScheduledEvent) {
		processCountChange(true);

		const channelId = await getGuildEventAnnounce(event.guildId);
		if (channelId == null) {
			processCountChange(false);
			return;
		}

		const message = `**New Event has been Scheduled!**\n${event.url}`;

		await announceEvent(channelId, event, message);

		log.info(`Announced new Guild Scheduled Event in ${event.guild?.name}`);

		processCountChange(false);
	}
};
