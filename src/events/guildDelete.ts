//dependancies
import { Events, Guild } from "discord.js";
import { deleteGuild } from "../functions/databaseAPI";
import log from "../logger";

export = {
	name: Events.GuildDelete,
	once: false,

	async execute(guild: Guild) {
		log.info(`Left guild ${guild.name}.`);

		await deleteGuild(guild.id);
	}
};
