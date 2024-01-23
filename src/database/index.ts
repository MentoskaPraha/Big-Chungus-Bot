import log from "$logger";
import Keyv from "keyv";

//* Creates the databases and exports them so they can be used elsewhere

// Setup in memory database
export const inMemDB = new Keyv();
inMemDB.on("error", (error) => log.dbError("inMemDB", error, error.message));
inMemDB.on("disconnect", () => log.dbDisconnected("inMemDB"));
inMemDB.set("BlockAllInteractions", false);
inMemDB.set("BlockNewInteractions", false);
log.dbOnline("inMemDB");
