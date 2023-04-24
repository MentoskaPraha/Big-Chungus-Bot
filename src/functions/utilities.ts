import {
	Collection,
	CommandInteraction,
	GuildMemberRoleManager
} from "discord.js";
import { createGuild, getGuild } from "./guildDatabase";
import { guildDBEntry, userDBEntry } from "../types";
import { createUser, getUser } from "./userDatabase";
import { join } from "node:path";
import { readdirSync } from "node:fs";

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

/**
 * Function to get a guild's DB entry and handle creating one if they don't have one.
 * @param guildId the id of the guild
 * @returns guildDBEntry object containing the guild's DB entry
 */
export async function getGuildDBEntry(guildId: string) {
	let potentialDBEntry = await getGuild(guildId);
	if (potentialDBEntry == null) {
		await createGuild(guildId);
		potentialDBEntry = await getGuild(guildId);
	}
	return potentialDBEntry as guildDBEntry;
}

/**
 * Function to get a user's DB entry and handle creating one if they don't have one.
 * @param userId the id of the user
 * @returns userDBEntry object containing the user's DB entry
 */
export async function getUserDBEntry(userId: string) {
	let potentialDBEntry = await getUser(userId);
	if (potentialDBEntry == null) {
		await createUser(userId);
		potentialDBEntry = await getUser(userId);
	}
	return potentialDBEntry as userDBEntry;
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
