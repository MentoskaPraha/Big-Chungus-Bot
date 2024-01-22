import log from "$logger";
import Keyv from "keyv";

//* Creates the databases and exports them so they can be used elsewhere

// Setup in memory database
export const inMemDB = new Keyv();
inMemDB.once("ready", () => log.info("In memory database is ready!"));
inMemDB.on("error", (error) => log.error(error, error.message));
inMemDB.set("BlockAllInteractions", false);
inMemDB.set("BlockNewInteractions", false);
