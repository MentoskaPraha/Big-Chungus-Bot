//dependancies
import {
	REST,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes
} from "discord.js";
import commandFiles from "$commands";
import log from "$lib/logger";

//register commands function
export default async function () {
	const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
	commandFiles.forEach((file) => {
		commands.push(file.data.toJSON());
	});

	log.info("Registering application commands...");

	//publish the commands to Discord
	const rest = new REST({ version: "10" }).setToken(
		process.env.DISCORD_BOT_TOKEN as string
	);

	await rest
		.put(
			Routes.applicationCommands(
				process.env.DISCORD_BOT_CLIENT_ID as string
			),
			{ body: commands }
		)
		.then(() => log.info("Successfully registered application commands!"))
		.catch((error) => {
			log.error(error, "Failed to register application commands!");
		});
}
