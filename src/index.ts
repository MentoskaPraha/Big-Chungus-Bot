//dependancies
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Client, GatewayIntentBits, ActivityType, Events } from "discord.js";
import { eventObject } from "./types";
import registerCmd from "./functions/deploy-cmds";
import { userDBConnect } from "./functions/userDatabase";
import log from "./logger";
import { guildDBConnect } from "./functions/guildDatabase";

//main function
(async () => {
	log.info("Creating new client instance...");

	//client
	const client = new Client({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
	});

	log.info("Preparing Discord event handler...");

	//set-up discord event handler
	const eventsPath = join(__dirname, "events");
	const eventFiles = readdirSync(eventsPath).filter((file) =>
		file.endsWith(".js")
	);
	for (const file of eventFiles) {
		const filePath = join(eventsPath, file);
		const event = import(filePath) as unknown as eventObject;
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	log.info("Preparing databases...");
	userDBConnect();
	guildDBConnect();

	//register the commands
	await registerCmd();

	//Login to Discord with your client's token
	log.info("Logging in...");
	client.login(process.env.DISCORD_BOT_TOKEN);

	// When the client is ready, run this code (only once)
	client.once(Events.ClientReady, () => {
		client.user?.setPresence({
			activities: [
				{
					name: "The Big Chungus Relegion",
					type: ActivityType.Watching
				}
			],
			status: "online"
		});
		log.info("The bot is ready!");
	});
})();
