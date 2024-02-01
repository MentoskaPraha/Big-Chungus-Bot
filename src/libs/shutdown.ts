import log from "$logger";
import { guildDB, inMemDB, userDB } from "@database";
import birthdayCron from "@subsystems/birthdays/cron-task";
import { setBlockAll } from "@database/state";
import client from "$client";

export default async function shutdown() {
	log.warn("Shutting down bot!");

	log.info("Blocking all requests...");
	setBlockAll(true);

	log.info("Disconnecting databases...");
	await inMemDB.disconnect();
	await guildDB.disconnect();
	await userDB.disconnect();

	log.info("Stopping cron tasts...");
	birthdayCron.stop();

	log.info("Flushing logs and exitting program...");
	log.shutdown();
	await client.destroy();

	process.exit(0);
}
