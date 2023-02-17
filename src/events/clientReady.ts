//dependancies
import { Client, Events, ActivityType } from "discord.js";
import log from "../logger";

export = {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client) {
		client.user?.setPresence({
			activities: [
				{
					name: "The Big Chungus Relegion",
					type: ActivityType.Watching
				}
			],
			status: "online"
		});
		log.info("The bot is ready!");
	}
};
