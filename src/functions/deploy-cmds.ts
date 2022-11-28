//dependancies
import { REST, Routes } from "discord.js";
import commandFiles from "../commands/_commandList";
import log from "../logger";
import { commandObject } from "../types";
const { clientId } = require("../configuration/config.json");

//register commands
export = {
	name: "deploy-cmds",
	async execute(){
		const commands = [];
		for (const file of commandFiles) {
			const command = file as unknown as commandObject
			commands.push(command.data.toJSON());
		}

		log.info("Registering application commands...");

		//publish the commands to Discord
		const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

		rest.put(Routes.applicationCommands(clientId), { body: commands })
			.then(() => log.info("Successfully registered application commands!"))
			.catch(log.error);
	}
}
