//libraries
import * as fs from "node:fs";
import * as path from "node:path";
import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { userDBFuncs } from "./types";
import log from "./logger";
import functions from "./functions/_functionList";

//tell the user that the bot is preparing
log.info("Preparing for bot activation...");

// Create a new client instance
log.info("Creating new client instance...");
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildScheduledEvents
	]
});

//add events to the client event collections
log.info("Adding events to the client event collection...");
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//let the user know that the bot is almost ready
log.info("Preforming final preparations...");

//sync the database
const userDB = functions.get("userDB") as userDBFuncs;
userDB.syncDB();

//register the commands
const registerCmds:any = functions.get("deploy-cmds");
try {
	registerCmds.execute();
} catch (error) {
	log.error(error);
}

// Login to Discord with your client's token
log.info("Logging in...");
client.login(process.env.DISCORD_BOT_TOKEN);

// When the client is ready, run this code (only once)
client.once("ready", () => {
	client.user!.setPresence({ activities: [{ name: "The Big Chungus Relegion", type: ActivityType.Watching}], status: "online" });
	log.info("The bot is ready!");
});
