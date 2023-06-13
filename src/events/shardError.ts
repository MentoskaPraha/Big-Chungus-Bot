//dependancies
import { Events } from "discord.js";
import log from "$lib/logger";

export = {
	name: Events.ShardError,
	once: false,

	async execute(error: Error) {
		log.error(error, "Shard error (possible disconnection).");
	}
};
