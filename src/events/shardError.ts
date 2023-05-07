//dependancies
import { Events } from "discord.js";
import log, { logError } from "$lib/logger";

export = {
	name: Events.ShardError,
	once: false,

	async execute(error: string) {
		log.error("Shard error (possible disconnection).");

		logError(error);
	}
};
