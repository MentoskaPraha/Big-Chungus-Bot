//dependancies
import { Events, Guild } from "discord.js";
import { createGuild } from "$lib/databaseAPI";
import log from "$lib/logger";

export = {
	name: Events.GuildCreate,
	once: false,

	async execute(guild: Guild) {
		log.info(`Joined new guild ${guild.name}.`);

		await createGuild(guild.id);
	}
};
