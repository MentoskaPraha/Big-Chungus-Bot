//dependancies
import { MongoClient } from "mongodb";
import { guildDBEntry } from "../types";
import log from "../logger";

const DBclient = new MongoClient(process.env.DISCORD_BOT_DB_URI as string);
const DBname = process.env.DISCORD_BOT_DB_NAME as string;
const CollectionName = "guildDB";

/**
 * guildDBConnect
 * Connects the bot to the mongoDB database.
 */
export async function guildDBConnect() {
	await DBclient.connect();
	log.info("Connected to guildDB.");
}

/**
 * guildDBDisconnect
 * Disconnects the bot from the mongoDB database.
 */
export async function guildDBDisconnect() {
	await DBclient.close();
	log.info("Disconnected from guildDB.");
}

/**
 * createGuild
 * Creates a new guild entry in the guildDB.
 * @param id The Discord id of the guild.
 * @returns True or false depending on if the action was successful.
 */
export async function createGuild(id: string) {
	const guild = {
		id: id,
		colors: false,
		colorRoleIds: ["N/A"],
		settingsManagerRoleId: "N/A",
		moderatorRoleId: "N/A",
		announcementRoleId: "N/A",
		announceEvents: false,
		crosspostEventAnnounce: false,
		eventAnnounceChannelId: "N/A"
	};

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.insertOne(guild);
		log.info(`Created entry guildDB-${id}.`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * getGuild
 * Gets a guild entry from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild object or null if the guild doesn't exist.
 */
export async function getGuild(id: string) {
	let entry = null;
	let guild = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry guildDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		guild = {
			id: entry.id,
			colors: entry.colors,
			colorRoleIds: entry.colorRoleIds,
			settingsManagerRoleId: entry.settingsManagerRoleId,
			moderatorRoleId: entry.moderatorRoleId,
			announcementRoleId: entry.announcementRoleId,
			announceEvents: entry.announceEvents,
			crosspostEventAnnounce: entry.crosspostEventAnnounce,
			eventAnnounceChannelId: entry.eventAnnounceChannelId
		} as guildDBEntry;
	} else {
		return null;
	}

	return guild;
}

/**
 * deleteGuild
 * Deletes a guild entry from guildDB.
 * @param id The Discord id of the guild that you wish to delete.
 * @returns True or false depending on if the action was successful.
 */
export async function deleteGuild(id: string) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.deleteOne({ id });
		log.info(`Deleted entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateGuildColor
 * Updates the guild color settings.
 * @param id The Discord id of the guild that you wish to update.
 * @param newColor The new color settings the guild will have.
 * @returns True or false depending on if the action was successful.
 */
export async function updateGuildColor(id: string, newColor: boolean) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne({ id }, { $set: { colors: newColor } });
		log.info(`Updated COLOR in entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateGuildColorList
 * Updates the guild color role id list.
 * @param id The Discord id of the guild that you wish to update.
 * @param newColorList The new color role id list the guild will have.
 * @returns True or false depending on if the action was successful.
 */
export async function updateGuildColorList(
	id: string,
	newColorList: Array<string>
) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne(
			{ id },
			{ $set: { colorRoleIds: newColorList } }
		);
		log.info(`Updated COLORROLEIDS in entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateGuildAnnouncerId
 * Updates the guild announcement role id.
 * @param id The Discord id of the guild that you wish to update.
 * @param newAnnouncerId The new announce role id the guild will have.
 * @returns True or false depending on if the action was successful.
 */
export async function updateGuildAnnouncerId(
	id: string,
	newAnnouncerId: string
) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne(
			{ id },
			{ $set: { announcementRoleId: newAnnouncerId } }
		);
		log.info(`Updated ANNOUNCEMENTROLEID in entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateGuildSettingsManagerId
 * Updates the guild settings manager role id.
 * @param id The Discord id of the guild that you wish to update.
 * @param newSettingsManagerId The new settings manager role id the guild will have.
 * @returns True or false depending on if the action was successful.
 */
export async function updateGuildSettingsManagerId(
	id: string,
	newSettingsManagerId: string
) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne(
			{ id },
			{ $set: { settingsManagerRoleId: newSettingsManagerId } }
		);
		log.info(`Updated SETTINGSMANAGERROLEID in entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateGuildModeratorId
 * Updates the guild moderator role id.
 * @param id The Discord id of the guild that you wish to update.
 * @param newModeratorId The new moderator role id the guild will have.
 * @returns True or false depending on if the action was successful.
 */
export async function updateGuildModeratorId(
	id: string,
	newModeratorId: string
) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne(
			{ id },
			{ $set: { moderatorRoleId: newModeratorId } }
		);
		log.info(`Updated MODERATORROLEID in entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateGuildAnnounceEvents
 * Updates the event announcement channel
 * @param id The Discord id of the guild that you wish to update.
 * @param newAnnounceEvents The new announce events settings the guild will have.
 * @returns True or false depending on if the action was successful.
 */
export async function updateGuildAnnounceEvents(
	id: string,
	newAnnounceEvents: boolean
) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne(
			{ id },
			{ $set: { announceEvents: newAnnounceEvents } }
		);
		log.info(`Updated ANNOUNCEEVENTS in entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateGuildCrosspostEventsAnnounce
 * Updates the event announcement channel
 * @param id The Discord id of the guild that you wish to update.
 * @param newCrosspostEventsAnnounce The new  crosspost events announce settings the guild will have.
 * @returns True or false depending on if the action was successful.
 */
export async function updateGuildCrosspostEventsAnnounce(
	id: string,
	newCrosspostEventsAnnounce: boolean
) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne(
			{ id },
			{ $set: { crosspostEventAnnounce: newCrosspostEventsAnnounce } }
		);
		log.info(`Updated CROSSPOSTEVENTANNOUNCE in entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateGuildEventAnnounceChannelId
 * Updates the event announcement channel
 * @param id The Discord id of the guild that you wish to update.
 * @param newEventChannelId The new event announcement channel id the guild will have.
 * @returns True or false depending on if the action was successful.
 */
export async function updateGuildEventAnnounceChannelId(
	id: string,
	newEventChannelId: string
) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne(
			{ id },
			{ $set: { eventAnnounceChannelId: newEventChannelId } }
		);
		log.info(`Updated EVENTANNOUNCECHANNELID in entry guildDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * getGuildColor
 * Gets a guild entry's color from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild color array or null if the guild doesn't have colors enabled.
 */
export async function getGuildColor(id: string) {
	let entry = null;
	let guild = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry guildDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		guild = {
			id: entry.id,
			colors: entry.colors,
			colorRoleIds: entry.colorRoleIds
		} as guildDBEntry;
	} else {
		return null;
	}

	if (!guild.colors) return null;

	return guild.colorRoleIds;
}

/**
 * getGuildAnnouncerId
 * Gets a guild entry's announcement role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild announcement role id.
 */
export async function getGuildAnnouncerId(id: string) {
	let entry = null;
	let guild = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry guildDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		guild = {
			id: entry.id,
			announcementRoleId: entry.announcementRoleId
		} as guildDBEntry;
	} else {
		return null;
	}

	if (guild.announcementRoleId != "N/A") {
		return guild.announcementRoleId;
	} else {
		return null;
	}
}

/**
 * getGuildSettingsManagerId
 * Gets a guild entry's settings manager role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild settings manager role id.
 */
export async function getGuildSettingsManagerId(id: string) {
	let entry = null;
	let guild = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry guildDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		guild = {
			id: entry.id,
			settingsManagerRoleId: entry.settingsManagerRoleId
		} as guildDBEntry;
	} else {
		return null;
	}

	if (guild.settingsManagerRoleId != "N/A") {
		return guild.settingsManagerRoleId;
	} else {
		return null;
	}
}

/**
 * getGuildModeratorId
 * Gets a guild entry's moderator role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild moderator role id.
 */
export async function getGuildModeratorId(id: string) {
	let entry = null;
	let guild = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry guildDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		guild = {
			id: entry.id,
			moderatorRoleId: entry.moderatorRoleId
		} as guildDBEntry;
	} else {
		return null;
	}

	if (guild.moderatorRoleId != "N/A") {
		return guild.moderatorRoleId;
	} else {
		return null;
	}
}

/**
 * getGuildCrosspostEventAnnounce
 * Gets a guild entry's crosspost event announcement setting from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild crosspost event announcement setting.
 */
export async function getGuildCrosspostEventAnnounce(id: string) {
	let entry = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry guildDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		return entry.crosspostEventAnnounce;
	} else {
		return false;
	}
}

/**
 * getGuildEventAnnounceChannel
 * Gets a guild entry's event announcement channel id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild event announcement channel id or null if the feature is disabled.
 */
export async function getGuildEventAnnounceChannel(id: string) {
	let entry = null;
	let guild = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry guildDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		guild = {
			id: entry.id,
			announceEvents: entry.announceEvents,
			eventAnnounceChannelId: entry.eventAnnounceChannelId
		} as guildDBEntry;
	} else {
		return null;
	}

	if (guild.announceEvents) {
		return guild.eventAnnounceChannelId;
	} else {
		return null;
	}
}
