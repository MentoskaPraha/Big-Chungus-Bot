//dependancies
import { REST, Routes } from "discord.js";
import commandFiles from "../commands/_commandList";
import log from "../logger";
import { commandObject } from "../types";
import { clientId } from "../config.json";

//register commands function
export default async function () {
	const commands = [];
	for (const file of commandFiles) {
		const command = file[1] as commandObject;
		commands.push(command.data.toJSON());
	}

	log.info("Registering application commands...");

	//publish the commands to Discord
	const rest = new REST({ version: "10" }).setToken(
		process.env.DISCORD_BOT_TOKEN as string
	);

	rest.put(Routes.applicationCommands(clientId), { body: commands })
		.then(() => log.info("Successfully registered application commands!"))
		.catch((error) => log.error(error));
}
