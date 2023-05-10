import { PrismaClient, userDB, guildDB } from "./prisma-client";
import log from "$lib/logger";

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
	const entry = (await db.userDB.create({
		data: {
			userId: id
		}
	})) as userDB;
	log.info(`Created entry userDB-${id}.`);

	return entry;
}

/**
 * Gets a user entry from userDB.
 * @param id The Discord id of the user that you wish to get.
 * @returns The user object or null if the user doesn't exist.
 */
export async function getUser(id: string) {
	const entry = (await db.userDB.findUnique({
		where: {
			userId: id
		}
	})) as userDB;
	log.info(`Reading entry userDB-${id}.`);

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
		.delete({ where: { userId: id } })
		.catch(() => (success = false))
		.then(() => log.info(`Deleted entry userDB-${id}`));
	return success;
}

/**
 * Updates the users title.
 * @param id The Discord id of the user that you wish to update.
 * @param newValue The new title the user will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateUserTitle(id: string, newValue: string) {
	let success = true;
	await db.userDB
		.upsert({
			create: { userId: id, title: newValue },
			update: { title: newValue },
			where: { userId: id }
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
export async function updateUserColor(id: string, newValue: number) {
	let success = true;
	await db.userDB
		.upsert({
			create: { userId: id, color: newValue },
			update: { color: newValue },
			where: { userId: id }
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
	const entry = (await db.userDB.findUnique({
		where: {
			userId: id
		},
		select: {
			title: true
		}
	})) as {
		title: string;
	};
	log.info(`Reading entry userDB-${id}.`);

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
	const entry = (await db.userDB.findUnique({
		where: {
			userId: id
		},
		select: {
			color: true
		}
	})) as {
		color: number;
	};
	log.info(`Reading entry userDB-${id}.`);

	if (entry == null) return 0;
	return entry.color;
}

/**
 * Creates a new guild entry in the guildDB.
 * @param id The Discord id of the guild.
 * @returns True or false depending on whether the action was successful.
 */
export async function createGuild(id: string) {
	const entry = (await db.guildDB.create({
		data: {
			guildId: id
		}
	})) as guildDB;
	log.info(`Created entry guildDB-${id}.`);

	return entry;
}

/**
 * Gets a guild entry from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The user object or null if the user doesn't exist.
 */
export async function getGuild(id: string) {
	const entry = await db.guildDB.findUnique({
		where: {
			guildId: id
		}
	});
	log.info(`Reading entry guildDB-${id}.`);

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
		.delete({ where: { guildId: id } })
		.catch(() => (success = false))
		.then(() => log.info(`Deleted entry guildDB-${id}`));
	return success;
}

/**
 * Updates the guild's color settings.
 * @param id The Discord id of the guild that you wish to update.
 * @param newValue Whether the guild's colors will be enabled.
 * @returns True or false depending on whther the action was successful.
 */
export async function updateGuildColorEnabled(id: string, newValue: boolean) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { guildId: id, colorSettingsEnabled: newValue },
			update: { colorSettingsEnabled: newValue },
			where: { guildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(`Updated COLORSETTINGSENABLED in entry guildDB-${id}`)
		);
	return success;
}

/**
 * Updates the guild's color role id list.
 * @param id The Discord id of the guild that you wish to update.
 * @param newValue The new list of color roles (IDs only).
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildColorRoleList(
	id: string,
	newColorList: Array<string>
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { guildId: id, colorSettingsRoleIds: newColorList },
			update: { colorSettingsRoleIds: newColorList },
			where: { guildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(`Updated COLORSETTINGSROLEIDS in entry guildDB-${id}`)
		);
	return success;
}

/**
 * Updates the guild's event announce setting.
 * @param id The Discord id of the guild that you wish to update.
 * @param newValue Whether the bot will announce scheduled events or not.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildEventAnnounceEnabled(
	id: string,
	newValue: boolean
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { guildId: id, eventAnnounceSettingsEnabled: newValue },
			update: { eventAnnounceSettingsEnabled: newValue },
			where: { guildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(
				`Updated EVENTANNOUNCESETTINGSENABLED in entry guildDB-${id}`
			)
		);
	return success;
}

/**
 * Updates the guild's event announce crosspost settings.
 * @param id The Discord id of the guild that you wish to update.
 * @param newValue Whether the bot crosspost's scheduled events in this guild.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildEventAnnounceCrosspost(
	id: string,
	newValue: boolean
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: {
				guildId: id,
				eventAnnounceSettingsCrosspost: newValue
			},
			update: { eventAnnounceSettingsCrosspost: newValue },
			where: { guildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(
				`Updated EVENTANNOUNCESETTINGSCROSSPOST in entry guildDB-${id}`
			)
		);
	return success;
}

/**
 * Updates the guild's scheduled events announcement channel.
 * @param id The Discord id of the guild that you wish to update.
 * @param newValue The channel the bot will post scheduled events announcements to.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildEventAnnounceChannelId(
	id: string,
	newValue: string
) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { guildId: id, eventAnnounceSettingsChannelId: newValue },
			update: { eventAnnounceSettingsChannelId: newValue },
			where: { guildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(
				`Updated EVENTANNOUNCESETTINGSCHANNELID in entry guildDB-${id}`
			)
		);
	return success;
}

/**
 * Updates the guild announcer role.
 * @param id The Discord id of the guild that you wish to update.
 * @param newValue The new id of the announcer role.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildAnnouncerId(id: string, newValue: string) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { guildId: id, announcementRoleId: newValue },
			update: { announcementRoleId: newValue },
			where: { guildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(`Updated ANNOUNCEMENTROLEID in entry guildDB-${id}`)
		);
	return success;
}

/**
 * Updates the guild's settings manager role.
 * @param id The Discord id of the guild that you wish to update.
 * @param newValue The new id of the settings manager role.
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
				guildId: id,
				settingsManagerRoleId: newSettingsManagerId
			},
			update: { settingsManagerRoleId: newSettingsManagerId },
			where: { guildId: id }
		})
		.catch(() => (success = false))
		.then(() =>
			log.info(`Updated SETTINGSMANAGERROLEID in entry guildDB-${id}`)
		);
	return success;
}

/**
 * Updates the guild's moderator role.
 * @param id The Discord id of the guild that you wish to update.
 * @param newValue The new role id of the moderator role.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateGuildModeratorId(id: string, newValue: string) {
	let success = true;
	await db.guildDB
		.upsert({
			create: { guildId: id, moderatorRoleId: newValue },
			update: { moderatorRoleId: newValue },
			where: { guildId: id }
		})
		.catch(() => (success = false))
		.then(() => log.info(`Updated MODERATORROLEID in entry guildDB-${id}`));
	return success;
}

/**
 * Gets a guild entry's color role id list from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild color array or null if the guild doesn't have colors enabled.
 */
export async function getGuildColor(id: string) {
	const entry = (await db.guildDB.findUnique({
		where: {
			guildId: id
		},
		select: {
			colorSettingsEnabled: true,
			colorSettingsRoleIds: true
		}
	})) as {
		colorSettingsEnabled: boolean;
		colorSettingsRoleIds: Array<string>;
	};
	log.info(`Reading entry guildDB-${id}.`);

	if (entry == null || !entry.colorSettingsEnabled) return null;
	return entry.colorSettingsRoleIds;
}

/**
 * Gets a guild entry's announcement role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild announcement role id or null if it doesn't exist.
 */
export async function getGuildAnnouncerId(id: string) {
	const entry = (await db.guildDB.findUnique({
		where: {
			guildId: id
		},
		select: {
			announcementRoleId: true
		}
	})) as {
		announcementRoleId: string;
	};
	log.info(`Reading entry guildDB-${id}.`);

	if (entry == null || entry.announcementRoleId == "N/A") return null;
	return entry.announcementRoleId;
}

/**
 * Gets a guild entry's settings manager role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild settings manager role id or null if it doesn't exist.
 */
export async function getGuildSettingsManagerId(id: string) {
	const entry = (await db.guildDB.findUnique({
		where: {
			guildId: id
		},
		select: {
			settingsManagerRoleId: true
		}
	})) as {
		settingsManagerRoleId: string;
	};
	log.info(`Reading entry guildDB-${id}.`);

	if (entry == null || entry.settingsManagerRoleId == "N/A") return null;
	return entry.settingsManagerRoleId;
}

/**
 * Gets a guild entry's moderator role id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild moderator role id or null if it doesn't exist.
 */
export async function getGuildModeratorId(id: string) {
	const entry = (await db.guildDB.findUnique({
		where: {
			guildId: id
		},
		select: {
			moderatorRoleId: true
		}
	})) as {
		moderatorRoleId: string;
	};
	log.info(`Reading entry guildDB-${id}.`);

	if (entry == null || entry.moderatorRoleId == "N/A") return null;
	return entry.moderatorRoleId;
}

/**
 * Gets a guild entry's crosspost event announcement setting from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild crosspost event announcement setting.
 */
export async function getGuildEventAnnounceCrosspost(id: string) {
	const entry = (await db.guildDB.findUnique({
		where: {
			guildId: id
		},
		select: {
			eventAnnounceSettingsCrosspost: true
		}
	})) as {
		eventAnnounceSettingsCrosspost: boolean;
	};
	log.info(`Reading entry guildDB-${id}.`);

	if (entry == null) return false;
	return entry.eventAnnounceSettingsCrosspost;
}

/**
 * Gets a guild entry's event announcement channel id from guildDB.
 * @param id The Discord id of the guild that you wish to get.
 * @returns The guild event announcement channel id or null if the feature is disabled.
 */
export async function getGuildEventAnnounce(id: string) {
	const entry = (await db.guildDB.findUnique({
		where: {
			guildId: id
		},
		select: {
			eventAnnounceSettingsEnabled: true,
			eventAnnounceSettingsChannelId: true
		}
	})) as {
		eventAnnounceSettingsEnabled: boolean;
		eventAnnounceSettingsChannelId: string;
	};
	log.info(`Reading entry guildDB-${id}.`);

	if (entry == null || !entry.eventAnnounceSettingsEnabled) return null;
	return entry.eventAnnounceSettingsChannelId;
}
