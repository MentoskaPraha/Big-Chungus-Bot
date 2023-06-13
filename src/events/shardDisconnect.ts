//dependancies
import { Events } from "discord.js";
import { errorShutdown } from "$lib/appState";

export = {
	name: Events.ShardDisconnect,
	once: false,

	async execute(error: Error) {
		await errorShutdown(null, error, "Shard Disconnected.");
	}
};
