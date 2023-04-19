import { ActivityType, Client, Events } from "discord.js";
import ps from "ps-node";
import log, { logError } from "../logger";
import events from "../events/_eventList";
import { eventObject } from "../types";
import { userDBDisconnect } from "./userDatabase";
import { guildDBDisconnect } from "./guildDatabase";

function delay(time: number) {
	return new Promise(resolve => setTimeout(resolve, time));
}

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
	client.removeAllListeners();

	//re-add the error listener
	const errorEvent = events.find(
		(event) => event.name == Events.ShardError
	) as eventObject;
	client.on(errorEvent.name, (...args) => errorEvent.execute(...args));

	//ensure all processes are finished
	log.info("Awaiting all processes to be terminated...");
	let done = false;
	while (!done) {
		ps.lookup(
			{
				command: "node",
				psargs: "ux"
			},
			function (err, resultList) {
				if (err) {
					log.error("PS-Lookup error during shutdown.");
					logError(err);
					return;
				}

				if (resultList.length <= 3) done = true;
			}
		);
		
		await delay(1000);
	}

	//close database connections
	log.info("Closing database connections...");
	await userDBDisconnect();
	await guildDBDisconnect();

	//disconnect the bot from Discord
	log.info("Disconnecting from Discord...");
	client.destroy();

	//exit the application
	log.info("Shutdown Sequence complete. Terminating process...");
	process.exit(0);
}
