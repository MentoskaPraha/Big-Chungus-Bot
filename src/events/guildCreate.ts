//dependancies
import { Events, Guild } from "discord.js";
import { createGuild } from "../functions/databaseAPI";
import log from "../logger";

export = {
	name: Events.GuildCreate,
	once: false,

	async execute(guild: Guild) {
		log.info(`Joined new guild ${guild.name}.`);

		await createGuild(guild.id);
	}
};
