//dependancies
import * as fs from "node:fs";
import * as path from "node:path";
import { Client, GatewayIntentBits, ActivityType, Events } from "discord.js";
import { eventObject, funcObject, userDBFuncs } from "./types";
import log from "./logger";
import functions from "./functions/_functionList";

//main function
(async () => {
	log.info("Creating new client instance...");

	//client
	const client = new Client({ 
		intents: [
			GatewayIntentBits.Guilds, 
			GatewayIntentBits.GuildMessages
		]
	});

	log.info("Preparing Discord event handler...");

	//set-up discord event handler
	const eventsPath = path.join(__dirname, "events");
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath) as eventObject;
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	log.info("Preparing databases...");

	//set-up databases
	const userDB = functions.get("userDB") as userDBFuncs;
	await userDB.syncDB();

	//register the commands
	const registerCmds = functions.get("deploy-cmds") as funcObject;
	await registerCmds.execute();

	//Login to Discord with your client's token
	log.info("Logging in...");
	client.login(process.env.DISCORD_BOT_TOKEN);

	// When the client is ready, run this code (only once)
	client.once(Events.ClientReady, () => {
		client.user!.setPresence({ activities: [{ name: "The Big Chungus Relegion", type: ActivityType.Watching}], status: "online" });
		log.info("The bot is ready!");
	});
})();
