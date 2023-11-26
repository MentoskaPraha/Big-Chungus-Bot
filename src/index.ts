import { Client, Events, GatewayIntentBits } from "discord.js";
import logs from "@libs/logs";

// create a new client
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

// TODO Register events to client
client.once(Events.ClientReady, (c) => {
	logs.info("Ready!");
});

// TODO Register global commands

// TODO Connect to database

// TODO add SIGTERM handling

// login
client.login(process.env.DISCORD_TOKEN);
