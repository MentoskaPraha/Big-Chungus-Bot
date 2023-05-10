import {
	Collection,
	CommandInteraction,
	EmbedBuilder,
	GuildMemberRoleManager,
	GuildScheduledEvent,
	GuildTextBasedChannel
} from "discord.js";
import { join } from "node:path";
import { readdirSync } from "node:fs";
import {
	getGuildEventAnnounceCrosspost,
	updateGuildEventAnnounceCrosspost
} from "$lib/databaseAPI";

/**
 * Checks whether the user has a certain role or is the server owner.
 * @param interaction the interaction you're checking the permission on
 * @param checkId the id of the role the user must have
 * @returns true if the user has the permission, false if they don't
 */
export function checkUserPerms(
	interaction: CommandInteraction,
	checkId: string | null
) {
	if (interaction.user.id != interaction.guild?.ownerId) {
		return true;
	}

	if (
		!(interaction.member?.roles as GuildMemberRoleManager).cache.some(
			(role) => role.id == checkId
		)
	) {
		return true;
	}

	return false;
}

export async function announceEvent(
	channelId: string,
	event: GuildScheduledEvent,
	message: string
) {
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
			{ name: "Channel or Location", value: `${event.channel?.name}` }
		)
		.setThumbnail(event.coverImageURL())
		.setFooter({
			text: `**Author:** ${
				event.creator?.username
			}  **Created at:** <t:${Math.floor(
				event.createdTimestamp / 1000
			)}:F>`
		});

	const channel = event.guild?.channels.cache.find(
		(channel) => channel.id == channelId
	) as GuildTextBasedChannel;

	channel
		.send({ content: message, embeds: [embed] })
		.then(async (message) => {
			if (await getGuildEventAnnounceCrosspost(event.guildId)) {
				try {
					message.crosspost();
				} catch (error) {
					updateGuildEventAnnounceCrosspost(event.guildId, false);
				}
			}
		});
}

/**
 * Reads exported objects from a directory. The exported objects must have a name property.
 * Files starting with `_` will not be read and the files must be TS or JS files.
 * @param path the path to the directory with the files to read
 * @returns `Collection<string, unknown>`
 */
export function readFiles(path: string) {
	//create variables
	const items = new Collection<string, unknown>();
	const itemPath = join(path);
	const itemFiles = readdirSync(itemPath).filter(
		(file) =>
			(file.endsWith(".js") || file.endsWith(".ts")) &&
			!file.startsWith("_")
	);

	//get the items
	itemFiles.forEach(async (file) => {
		const filePath = join(itemPath, file);
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const item = require(filePath);
		items.set(item.name, item);
	});

	return items;
}

/**
 * Waits a number of milliseconds.
 * @param time the number of milliseconds to wait.
 */
export function delay(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
