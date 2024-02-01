import { guildDB } from "@database";
import { Snowflake } from "discord.js";

export interface guildEntry {
	birthdayChannel: Snowflake | undefined;
}

/**
 * Creates a new user in userDB.
 * @param id The id of the user.
 * @returns the new user that got created in the database.
 */
export async function createGuild(id: Snowflake) {
	const newUser: guildEntry = {
		birthdayChannel: undefined
	};
	await guildDB.set(id, newUser);
	return newUser;
}

/**
 * Gets a user from userDB.
 * @param id The id of the user.
 * @returns The specified user.
 */
export async function getGuild(id: Snowflake) {
	const user = (await guildDB.get(id)) as guildEntry | undefined;
	if (user == undefined) return await createGuild(id);
	return user;
}

/**
 * Gets the channel birthdays are announced to.
 * @param id The id of the guild.
 * @returns The channel id or undefined if the property is unset.
 */
export async function getGuildBirthdayChannel(id: Snowflake) {
	const guild = (await getGuild(id)) as guildEntry;
	return guild.birthdayChannel;
}

/**
 * Sets the channel birthdays will be announced to.
 * @param id The id of the guild.
 * @param newChannel The new channel birthdays will be announced in. Ommit if you wish to unset this property.
 */
export async function setGuildBirthdayChannel(
	id: Snowflake,
	newChannel?: Snowflake
) {
	let guild = (await getGuild(id)) as guildEntry;
	guild.birthdayChannel = newChannel;
	await guildDB.set(id, guild);
}
