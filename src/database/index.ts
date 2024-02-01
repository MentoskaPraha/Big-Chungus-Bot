import log from "$logger";
import Keyv from "keyv";
import { join } from "node:path";

//* Creates the databases and exports them so they can be used elsewhere
// Setup in memory database
export const inMemDB = new Keyv();
inMemDB.on("error", (error) => log.dbError("inMemDB", error, error.message));
inMemDB.on("disconnect", () => log.dbDisconnected("inMemDB"));
inMemDB.set("BlockAllInteractions", false);
inMemDB.set("BlockNewInteractions", false);
log.dbOnline("inMemDB");

// Setup user database
export const userDB = new Keyv(
	`sqlite://${join(
		__dirname.split("/src")[0].split("/libs")[0],
		"data",
		"database.sqlite"
	)}`,
	{ namespace: "users" }
);
userDB.on("error", (error) => log.dbError("userDB", error, error.message));
userDB.on("disconnect", () => log.dbDisconnected("userDB"));
log.dbOnline("userDB");

// Setup guild database
export const guildDB = new Keyv(
	`sqlite://${join(
		__dirname.split("/src")[0].split("/libs")[0],
		"data",
		"database.sqlite"
	)}`,
	{ namespace: "guilds" }
);
guildDB.on("error", (error) => log.dbError("guildDB", error, error.message));
guildDB.on("disconnect", () => log.dbDisconnected("guildDB"));
log.dbOnline("guildDB");
