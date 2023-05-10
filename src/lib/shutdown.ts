import { ActivityType, Client, Events } from "discord.js";
import log from "$lib/logger";
import events from "$events";
import { disconnectDB } from "$lib/databaseAPI";

export async function shutdown(client: Client) {
	log.warn("Started shutdown sequence...");

	//set presence to let users know of the shutdown
	client.user?.setPresence({
		activities: [
			{
				name: "The Shutdown Process",
				type: ActivityType.Watching
			}
		],
		status: "dnd"
	});

	//remove all event listeners from client
	log.info("Stopping new requests...");
	events.forEach((event) => {
		if (event.name == Events.ShardError) return;
		client.off(event.name, (...args) => event.execute(...args));
	});

	//TODO Write code that handles awaiting for completion of all requests.
	////log.

	//close database connections
	log.info("Closing database connections...");
	await disconnectDB();

	//disconnect the bot from Discord
	log.info("Disconnecting from Discord...");
	client.destroy();

	//exit the application
	log.info("Shutdown Sequence complete. Terminating process...");
	log.flush();
	process.exit(0);
}
