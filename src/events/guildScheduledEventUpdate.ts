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
	name: Events.GuildScheduledEventUpdate,
	once: false,

	async execute(
		oldEvent: GuildScheduledEvent,
		newEvent: GuildScheduledEvent
	) {
		const channelId = await getGuildEventAnnounceChannel(newEvent.guildId);
		if (channelId == null) return;

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

		const embed = new EmbedBuilder()
			.setTitle(newEvent.name)
			.setDescription(
				newEvent.description != ""
					? newEvent.description
					: "This event has no description!"
			)
			.addFields(
				{
					name: "Start Time",
					value: `<t:${Math.floor(
						(newEvent.scheduledStartTimestamp as number) / 1000
					)}:F>`
				},
				{ name: "Channel", value: `${newEvent.channel?.name}` }
			);

		const channel = newEvent.guild?.channels.cache.find(
			(channel) => channel.id == channelId
		) as GuildTextBasedChannel;

		channel
			.send({ content: message, embeds: [embed] })
			.then(async (message) => {
				if (await getGuildCrosspostEventAnnounce(newEvent.guildId)) {
					try {
						message.crosspost();
					} catch (error) {
						updateGuildCrosspostEventsAnnounce(
							newEvent.guildId,
							false
						);
					}
				}
			});

		log.info(
			`Announced update/start of a Guild Scheduled Event in ${newEvent.guild?.name}`
		);
	}
};
