import { inMemDB } from "@database";

/**
 * Gets the value of whether or not the bot is accepting any interactions.
 * If this is false all interaction, with the status command being an exeption,
 * should be ignored.
 * @returns The block all value.
 */
export async function checkBlockAll() {
	return (await inMemDB.get("BlockAllInteractions")) as boolean;
}

/**
 * Gets the value of whether or not the bot is accepting new interactions.
 * This allows the user to complete multi-interaction tasks and prevents
 * new ones from being started.
 * @returns The block value.
 */
export async function checkBlockNew() {
	return (await inMemDB.get("BlockNewInteraction")) as boolean;
}

/**
 * Sets the value of whether or not the bot is accepting any interactions.
 * If this is false all interaction, with the status command being an exeption,
 * should be ignored.
 * @param newValue The new block value.
 */
export async function setBlockAll(newValue: boolean) {
	await inMemDB.set("BlockAllInteractions", newValue);
}

/**
 * Sets the value of whether or not the bot is accepting new interactions.
 * This allows the user to complete multi-interaction tasks and prevents
 * new ones from being started.
 * @param newValue The new block value.
 */
export async function setBlockNew(newValue: boolean) {
	await inMemDB.set("BlockNewInteraction", newValue);
}
