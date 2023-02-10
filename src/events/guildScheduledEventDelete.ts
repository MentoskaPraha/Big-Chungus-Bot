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
	name: Events.GuildScheduledEventDelete,
	once: false,

	async execute(event: GuildScheduledEvent) {
		const channelId = await getGuildEventAnnounceChannel(event.guildId);
		if (channelId == null) return;

		let message: string;

		if (event.isCompleted()) {
			message = `**An Event has Finished!**\n${event.url}`;
		} else {
			message = `**An Event was Cancelled!**\n${event.url}`;
		}

		const embed = new EmbedBuilder()
			.setTitle(event.name)
			.setDescription(event.description)
			.addFields(
				{
					name: "Start Time",
					value: `<t:${event.scheduledStartTimestamp}:F>`
				},
				{ name: "Author", value: `${event.creator?.username}` },
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
			`Announced cancellation/completion a Guild Scheduled Event in ${event.guild?.name}`
		);
	}
};
