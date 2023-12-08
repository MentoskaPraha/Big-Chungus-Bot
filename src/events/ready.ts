import { Events } from "discord.js";
import log from "$logger";

export default {
	name: Events.ClientReady,
	once: true,

	async execute() {
		log.info("Client is ready!");
	}
};
