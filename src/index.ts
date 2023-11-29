import { Client, Events, GatewayIntentBits } from "discord.js";
import log from "@libs/logs";

// create a new client
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

// TODO Register events to client
client.once(Events.ClientReady, (c) => {
	log.info("Ready!");
});

// TODO Register global commands

// TODO Connect to database

// TODO add SIGTERM, SIGINT and SIGBREAK handling

// login
log.info("Logging in...");
client.login(process.env.DISCORD_TOKEN).catch((error) => {
	log.error(error, "Login failed");
});
