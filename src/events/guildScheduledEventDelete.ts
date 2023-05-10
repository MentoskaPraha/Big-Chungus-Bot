//dependancies
import { Events, GuildScheduledEvent } from "discord.js";
import { getGuildEventAnnounce } from "$lib/databaseAPI";
import { announceEvent } from "$lib/utilities";
import log from "$lib/logger";

export = {
	name: Events.GuildScheduledEventDelete,
	once: false,

	async execute(event: GuildScheduledEvent) {
		const channelId = await getGuildEventAnnounce(event.guildId);
		if (channelId == null) return;

		const message = `**An Event was Cancelled!**\n${event.url}`;

		await announceEvent(channelId, event, message);

		log.info(
			`Announced cancellation/completion of a Guild Scheduled Event in ${event.guild?.name}`
		);
	}
};
