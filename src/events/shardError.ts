//dependancies
import { Events } from "discord.js";
import log from "../logger";

export = {
	name: Events.ShardError,
	once: false,

	async execute(error: string) {
		log.error(`Shard error (possible disconnection): ${error}`);
	}
};
