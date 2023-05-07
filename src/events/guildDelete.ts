//dependancies
import { Events, Guild } from "discord.js";
import { deleteGuild } from "$lib/databaseAPI";
import log from "$lib/logger";

export = {
	name: Events.GuildDelete,
	once: false,

	async execute(guild: Guild) {
		log.info(`Left guild ${guild.name}.`);

		await deleteGuild(guild.id);
	}
};
