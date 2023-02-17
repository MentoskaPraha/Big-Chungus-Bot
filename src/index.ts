//dependancies
import { Client, GatewayIntentBits } from "discord.js";
import events from "./events/_eventList";
import registerCmd from "./functions/deploy-cmds";
import { userDBConnect } from "./functions/userDatabase";
import { guildDBConnect } from "./functions/guildDatabase";
import log from "./logger";

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
	await userDBConnect();
	await guildDBConnect();

	//register the commands
	await registerCmd();

	//Login to Discord with your client's token
	log.info("Logging in...");
	client.login(process.env.DISCORD_BOT_TOKEN);
})();
