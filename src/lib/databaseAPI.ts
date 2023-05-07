import { PrismaClient } from "@prisma/client";
import log from "$lib/logger";

//database interfaces
export interface userDBEntry {
	id: string;
	title: string;
	color: number;
}

export interface guildDBEntry {
	id: string;
	colors: boolean;
	colorRoleIds: Array<string>;
	settingsManagerRoleId: string;
	moderatorRoleId: string;
	announcementRoleId: string;
	announceEvents: boolean;
	crosspostEventAnnounce: boolean;
	eventAnnounceChannelId: string;
}

//Database client
const db = new PrismaClient();

/**
 * Connects the bot to the database.
 */
export async function connectDB() {
	await db.$connect();
	log.info("Connected to database.");
}

/**
 * Disconnects the bot from the database.
 */
export async function disconnectDB() {
	await db.$disconnect();
	log.info("Disconnected from database.");
}

/**
 * Creates a new user entry in the userDB.
 * @param id The Discord id of the user.
 * @returns The user object or null if the user failed to create
 */
export async function createUser(id: string) {
	return (await db.userDB
		.create({
			data: {
				UserId: id
			}
		})
		.then(() => log.info(`Created entry userDB-${id}.`))) as userDBEntry;
}

/**
 * Gets a user entry from userDB.
 * @param id The Discord id of the user that you wish to get.
 * @returns The user object or null if the user doesn't exist.
 */
export async function getUser(id: string) {
	const entry = (await db.userDB
		.findUnique({
			where: {
				UserId: id
			}
		})
		.then(() => log.info(`Reading entry userDB-${id}.`))) as userDBEntry;
	if (entry == null) return await createUser(id);
	return entry;
}

/**
 * Deletes a user entry from userDB.
 * @param id The Discord id of the user that you wish to delete.
 * @returns True or false depending on whether the action was successful.
 */
export async function deleteUser(id: string) {
	let success = true;
	await db.userDB
		.delete({ where: { UserId: id } })
		.catch(() => (success = false))
		.then(() => log.info(`Deleted entry userDB-${id}`));
	return success;
}

/**
 * Updates the users title.
 * @param id The Discord id of the user that you wish to update.
 * @param newTitle The new title the user will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateUserTitle(id: string, newTitle: string) {
	let success = true;
	await db.userDB
		.upsert({
			create: { UserId: id, title: newTitle },
			update: { title: newTitle },
			where: { UserId: id }
		})
		.catch(() => (success = false))
		.then(() => log.info(`Updated TITLE in entry userDB-${id}`));
	return success;
}

/**
 * Updates the users color.
 * @param id The Discord id of the user that you wish to update.
 * @param newColor The id of the color that the user will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateUserColor(id: string, newColor: number) {
	let success = true;
	await db.userDB
		.upsert({
			create: { UserId: id, color: newColor },
			update: { color: newColor },
			where: { UserId: id }
		})
		.catch(() => (success = false))
		.then(() => log.info(`Updated COLOR in entry userDB-${id}`));
	return success;
}

/**
 * Gets the users title.
 * @param id The Discord id of the user that you wish to get the title of.
 * @returns The title of the user.
 */
export async function getUserTitle(id: string) {
	if (id == process.env.DISCORD_BOT_CLIENT_ID) return "Highest God";
	const entry = (await db.userDB
		.findUnique({
			where: {
				UserId: id
			},
			select: {
				title: true
			}
		})
		.then(() => log.info(`Reading entry userDB-${id}.`))) as userDBEntry;

	if (entry == null) return "Titleless";
	return entry.title;
}

/**
 * Gets the users color.
 * @param id The Discord id of the user that you wish to get the color of.
 * @returns The color of the user.
 */
export async function getUserColor(id: string) {
	if (id == process.env.DISCORD_BOT_CLIENT_ID) return 0;
	const entry = (await db.userDB
		.findUnique({
			where: {
				UserId: id
			},
			select: {
				color: true
			}
		})
		.then(() => log.info(`Reading entry userDB-${id}.`))) as userDBEntry;

	if (entry == null) return 0;
	return entry.color;
}

/**
 * Creates a new guild entry in the guildDB.
 * @param id The Discord id of the guild.
 * @returns True or false depending on whether the action was successful.
 */
export async function createGuild(id: string) {
	return (await db.guildDB
		.create({
			data: {
				GuildId: id
			}
		})
		.then(() => log.info(`Created entry guildDB-${id}.`))) as guildDBEntry;
}

/**
 * Gets a guild entry from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The user object or null if the user doesn't exist.
 */
export async function getGuild(id: string) {
	const entry = (await db.guildDB
		.findUnique({
			where: {
				GuildId: id
			}
		})
		.then(() => log.info(`Reading entry guildDB-${id}.`))) as guildDBEntry;
	if (entry == null) return await createGuild(id);
	return entry;
}

/**
 * Deletes a guild entry from guildDB.
 * @param id The Discord id of the guild that you wish to delete.
 * @returns True or false depending on whether the action was successful.
 */
export async function deleteGuild(id: string) {
	let success = true;
	await db.guildDB
		.delete({ where: { GuildId: id } })
		.catch(() => (success = false))
		.then(() => log.info(`Deleted entry guildDB-${id}`));
	return success;
}

/**
 * Updates the guild color settings.
 * @param id The Discord id of the guild that you wish to update.
 * @param newColor The new color settings the guild will have.
 * @returns True or false depending on whther the action was successful.
 */
export async function updateGuildColor(id: string, newColor: boolean) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { GuildId: id, colors: newColor },
			update: { colors: newColor },
			where: { GuildId: id }
		})
		.catch(() => (success = false))
		.then(() => log.info(`Updated COLOR in entry guildDB-${id}`));
	return success;
}

/**
 * Updates the guild color role id list.
 * @param id The Discord id of the guild that you wish to update.
 * @param newColorList The new color role id list the guild will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildColorList(
	id: string,
	newColorList: Array<string>
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { GuildId: id, colorRoleIds: newColorList },
			update: { colorRoleIds: newColorList },
			where: { GuildId: id }
		})
		.catch(() => (success = false))
		.then(() => log.info(`Updated COLORROLEIDS in entry guildDB-${id}`));
	return success;
}

/**
 * Updates the event announcement channel
 * @param id The Discord id of the guild that you wish to update.
 * @param newAnnounceEvents The new announce events settings the guild will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildAnnounceEvents(
	id: string,
	newAnnounceEvents: boolean
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { GuildId: id, announceEvents: newAnnounceEvents },
			update: { announceEvents: newAnnounceEvents },
			where: { GuildId: id }
		})
		.catch(() => (success = false))
		.then(() => log.info(`Updated ANNOUNCEEVENTS in entry guildDB-${id}`));
	return success;
}

/**
 * updateGuildCrosspostEventsAnnounce
 * Updates the event announcement channel
 * @param id The Discord id of the guild that you wish to update.
 * @param newCrosspostEventsAnnounce The new  crosspost events announce settings the guild will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildCrosspostEventsAnnounce(
	id: string,
	newCrosspostEventsAnnounce: boolean
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: {
				GuildId: id,
				crosspostEventAnnounce: newCrosspostEventsAnnounce
			},
			update: { crosspostEventAnnounce: newCrosspostEventsAnnounce },
			where: { GuildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(`Updated CROSSPOSTEVENTANNOUNCE in entry guildDB-${id}`)
		);
	return success;
}

/**
 * Updates the event announcement channel
 * @param id The Discord id of the guild that you wish to update.
 * @param newEventChannelId The new event announcement channel id the guild will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildEventAnnounceChannelId(
	id: string,
	newEventChannelId: string
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { GuildId: id, eventAnnounceChannelId: newEventChannelId },
			update: { eventAnnounceChannelId: newEventChannelId },
			where: { GuildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(`Updated EVENTANNOUNCECHANNELID in entry guildDB-${id}`)
		);
	return success;
}

/**
 * Updates the guild announcement role id.
 * @param id The Discord id of the guild that you wish to update.
 * @param newAnnouncerId The new announce role id the guild will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildAnnouncerId(
	id: string,
	newAnnouncerId: string
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { GuildId: id, announcementRoleId: newAnnouncerId },
			update: { announcementRoleId: newAnnouncerId },
			where: { GuildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(`Updated ANNOUNCEMENTROLEID in entry guildDB-${id}`)
		);
	return success;
}

/**
 * updateGuildSettingsManagerId
 * Updates the guild settings manager role id.
 * @param id The Discord id of the guild that you wish to update.
 * @param newSettingsManagerId The new settings manager role id the guild will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildSettingsManagerId(
	id: string,
	newSettingsManagerId: string
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: {
				GuildId: id,
				settingsManagerRoleId: newSettingsManagerId
			},
			update: { settingsManagerRoleId: newSettingsManagerId },
			where: { GuildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(`Updated SETTINGSMANAGERROLEID in entry guildDB-${id}`)
		);
	return success;
}

/**
 * Updates the guild moderator role id.
 * @param id The Discord id of the guild that you wish to update.
 * @param newModeratorId The new moderator role id the guild will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildModeratorId(
	id: string,
	newModeratorId: string
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { GuildId: id, moderatorRoleId: newModeratorId },
			update: { moderatorRoleId: newModeratorId },
			where: { GuildId: id }
		})
		.catch(() => (success = false))
		.then(() => log.info(`Updated MODERATORROLEID in entry guildDB-${id}`));
	return success;
}

/**
 * Gets a guild entry's color from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild color array or null if the guild doesn't have colors enabled.
 */
export async function getGuildColor(id: string) {
	const entry = (await db.guildDB
		.findUnique({
			where: {
				GuildId: id
			},
			select: {
				colors: true,
				colorRoleIds: true
			}
		})
		.then(() => log.info(`Reading entry guildDB-${id}.`))) as guildDBEntry;

	if (entry == null || !entry.colors) return null;
	return entry.colorRoleIds;
}

/**
 * Gets a guild entry's announcement role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild announcement role id or null if it doesn't exist.
 */
export async function getGuildAnnouncerId(id: string) {
	const entry = (await db.guildDB
		.findUnique({
			where: {
				GuildId: id
			},
			select: {
				announcementRoleId: true
			}
		})
		.then(() => log.info(`Reading entry guildDB-${id}.`))) as guildDBEntry;

	if (entry == null || entry.announcementRoleId == "N/A") return null;
	return entry.announcementRoleId;
}

/**
 * Gets a guild entry's settings manager role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild settings manager role id or null if it doesn't exist.
 */
export async function getGuildSettingsManagerId(id: string) {
	const entry = (await db.guildDB
		.findUnique({
			where: {
				GuildId: id
			},
			select: {
				settingsManagerRoleId: true
			}
		})
		.then(() => log.info(`Reading entry guildDB-${id}.`))) as guildDBEntry;

	if (entry == null || entry.settingsManagerRoleId == "N/A") return null;
	return entry.settingsManagerRoleId;
}

/**
 * Gets a guild entry's moderator role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild moderator role id or null if it doesn't exist.
 */
export async function getGuildModeratorId(id: string) {
	const entry = (await db.guildDB
		.findUnique({
			where: {
				GuildId: id
			},
			select: {
				moderatorRoleId: true
			}
		})
		.then(() => log.info(`Reading entry guildDB-${id}.`))) as guildDBEntry;

	if (entry == null || entry.moderatorRoleId == "N/A") return null;
	return entry.moderatorRoleId;
}

/**
 * Gets a guild entry's crosspost event announcement setting from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild crosspost event announcement setting.
 */
export async function getGuildCrosspostEventAnnounce(id: string) {
	const entry = (await db.guildDB
		.findUnique({
			where: {
				GuildId: id
			},
			select: {
				crosspostEventAnnounce: true
			}
		})
		.then(() => log.info(`Reading entry guildDB-${id}.`))) as guildDBEntry;

	if (entry == null) return false;
	return entry.crosspostEventAnnounce;
}

/**
 * Gets a guild entry's event announcement channel id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild event announcement channel id or null if the feature is disabled.
 */
export async function getGuildEventAnnounceChannel(id: string) {
	const entry = (await db.guildDB
		.findUnique({
			where: {
				GuildId: id
			},
			select: {
				announceEvents: true,
				eventAnnounceChannelId: true
			}
		})
		.then(() => log.info(`Reading entry guildDB-${id}.`))) as guildDBEntry;

	if (entry == null || !entry.announceEvents) return null;
	return entry.eventAnnounceChannelId;
}
