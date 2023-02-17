//dependancies
import { MongoClient } from "mongodb";
import { userDBEntry } from "../types";
import log from "../logger";

const DBclient = new MongoClient(process.env.DISCORD_BOT_DB_URI as string);
const DBname = process.env.DISCORD_BOT_DB_NAME as string;
const CollectionName = "userDB";

/**
 * userDBConnect
 * Connects the bot to the mongoDB database.
 */
export async function userDBConnect() {
	await DBclient.connect();
	log.info("Connected to userDB.");
}

/**
 * userDBDisconnect
 * Disconnects the bot from the mongoDB database.
 */
export async function userDBDisconnect() {
	await DBclient.close();
	log.info("Disconnected from userDB.");
}

/**
 * createUser
 * Creates a new user entry in the userDB.
 * @param id The Discord id of the user.
 * @returns True or false depending on whether the action was successful.
 */
export async function createUser(id: string) {
	const user = {
		id: id,
		title: "Titleless",
		color: 0
	};

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.insertOne(user);
		log.info(`Created entry userDB-${id}.`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * getUser
 * Gets a user entry from userDB.
 * @param id The Discord id of the user that you wish to get.
 * @returns The user object or null if the user doesn't exist.
 */
export async function getUser(id: string) {
	let entry = null;
	let user = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry userDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		user = {
			id: entry.id,
			title: entry.title,
			color: entry.color
		} as userDBEntry;
	}

	return user;
}

/**
 * deleteUser
 * Deletes a user entry from userDB.
 * @param id The Discord id of the user that you wish to delete.
 * @returns True or false depending on whether the action was successful.
 */
export async function deleteUser(id: string) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.deleteOne({ id });
		log.info(`Deleted entry userDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateUserTitle
 * Updates the users title.
 * @param id The Discord id of the user that you wish to update.
 * @param newTitle The new title the user will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateUserTitle(id: string, newTitle: string) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne({ id }, { $set: { title: newTitle } });
		log.info(`Updated TITLE in entry userDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * updateUserColor
 * Updates the users color.
 * @param id The Discord id of the user that you wish to update.
 * @param newColor The id of the color that the user will have.
 * @returns True or false depending on whether the action was successful.
 */
export async function updateUserColor(id: string, newColor: number) {
	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		await collection.updateOne({ id }, { $set: { color: newColor } });
		log.info(`Updated COLOR in entry userDB-${id}`);
		return true;
	} catch (error) {
		log.error(error);
		return false;
	}
}

/**
 * getUserTitle
 * Gets the users title.
 * @param id The Discord id of the user that you wish to get the title of.
 * @returns The title of the user.
 */
export async function getUserTitle(id: string) {
	let entry = null;
	let user = null;

	try {
		const collection = DBclient.db(DBname).collection(CollectionName);
		entry = await collection.findOne({ id });
		log.info(`Reading entry userDB-${id}.`);
	} catch (error) {
		log.error(error);
	}

	if (entry != null) {
		user = {
			id: entry.id,
			title: entry.title,
			color: entry.color
		} as userDBEntry;
	}

	if (user == null) {
		return "Titleless";
	} else {
		return user.title;
	}
}
