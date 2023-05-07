import {
	Collection,
	CommandInteraction,
	GuildMemberRoleManager
} from "discord.js";
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
