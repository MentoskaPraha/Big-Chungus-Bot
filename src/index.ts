//dependancies
import { Client, GatewayIntentBits } from "discord.js";
import events from "$events";
import registerCmd from "$lib/deploy-cmds";
import log from "$lib/logger";
import { shutdown } from "$lib/shutdown";
import { connectDB, disconnectDB } from "$lib/databaseAPI";

//main function
(async () => {
	log.info("Creating new client instance...");

	//client
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildScheduledEvents
		]
	});

	log.info("Preparing Discord event handler...");

	//set-up discord event handler
	events.forEach((event) => {
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	});

	log.info("Preparing databases...");
	await connectDB();

	//register the commands
	await registerCmd();

	//Login to Discord with your client's token
	log.info("Logging in...");
	client.login(process.env.DISCORD_BOT_TOKEN);

	//handle process signals
	process.on("SIGINT", async () => {
		log.info("Recieved SIGINT signal from OS.");
		await shutdown(client);
	});

	process.on("SIGTERM", async () => {
		log.info("Recieved SIGTERM signal from OS.");
		await shutdown(client);
	});

	process.on("uncaughtException", async (error) => {
		await disconnectDB();
		client.destroy();
		log.fatal(error, "Uncaught exception, system failure.");
		log.flush();
		process.exit(1);
	});
})();
