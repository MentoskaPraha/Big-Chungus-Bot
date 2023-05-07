//dependancies
import {
	Events,
	GuildScheduledEvent,
	EmbedBuilder,
	GuildTextBasedChannel
} from "discord.js";
import {
	getGuildEventAnnounceChannel,
	getGuildCrosspostEventAnnounce,
	updateGuildCrosspostEventsAnnounce
} from "$lib/databaseAPI";
import log from "$lib/logger";

export = {
	name: Events.GuildScheduledEventDelete,
	once: false,

	async execute(event: GuildScheduledEvent) {
		const channelId = await getGuildEventAnnounceChannel(event.guildId);
		if (channelId == null) return;

		const message = `**An Event was Cancelled!**\n${event.url}`;

		const embed = new EmbedBuilder()
			.setTitle(event.name)
			.setDescription(
				event.description != ""
					? event.description
					: "This event has no description!"
			)
			.addFields(
				{
					name: "Start Time",
					value: `<t:${Math.floor(
						(event.scheduledStartTimestamp as number) / 1000
					)}:F>`
				},
				{ name: "Channel", value: `${event.channel?.name}` }
			);

		const channel = event.guild?.channels.cache.find(
			(channel) => channel.id == channelId
		) as GuildTextBasedChannel;

		channel
			.send({ content: message, embeds: [embed] })
			.then(async (message) => {
				if (await getGuildCrosspostEventAnnounce(event.guildId)) {
					try {
						message.crosspost();
					} catch (error) {
						updateGuildCrosspostEventsAnnounce(
							event.guildId,
							false
						);
					}
				}
			});

		log.info(
			`Announced cancellation/completion of a Guild Scheduled Event in ${event.guild?.name}`
		);
	}
};
