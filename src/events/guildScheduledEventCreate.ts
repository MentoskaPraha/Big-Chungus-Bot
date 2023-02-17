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
} from "../functions/guildDatabase";
import log from "../logger";

export = {
	name: Events.GuildScheduledEventCreate,
	once: false,

	async execute(event: GuildScheduledEvent) {
		const channelId = await getGuildEventAnnounceChannel(event.guildId);
		if (channelId == null) return;

		const message = `**New Event has been Scheduled!**\n${event.url}`;

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

		log.info(`Announced new Guild Scheduled Event in ${event.guild?.name}`);
	}
};
