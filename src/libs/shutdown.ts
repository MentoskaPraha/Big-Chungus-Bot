import log from "$logger";
import { inMemDB } from "@database";
import { setBlockAll } from "@database/state";
import { Client } from "discord.js";

export default async function shutdown(client: Client) {
	log.warn("Shutting down bot!");

	log.info("Blocking all requests...");
	setBlockAll(true);

	log.info("Disconnecting databases...");
	await inMemDB.disconnect();

	log.info("Flushing logs and exitting program...");
	log.shutdown();
	await client.destroy();

	process.exit(0);
}
