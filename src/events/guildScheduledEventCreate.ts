//dependancies
import { Events, GuildScheduledEvent } from "discord.js";
import { getGuildEventAnnounce } from "$lib/databaseAPI";
import log from "$lib/logger";
import { announceEvent } from "$lib/utilities";

export = {
	name: Events.GuildScheduledEventCreate,
	once: false,

	async execute(event: GuildScheduledEvent) {
		const channelId = await getGuildEventAnnounce(event.guildId);
		if (channelId == null) return;

		const message = `**New Event has been Scheduled!**\n${event.url}`;

		await announceEvent(channelId, event, message);

		log.info(`Announced new Guild Scheduled Event in ${event.guild?.name}`);
	}
};
