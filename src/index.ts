import {
	Client,
	GatewayIntentBits,
	REST,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes
} from "discord.js";
import birthdayCron from "@subsystems/birthdays/cron-task";
import events from "$events";
import commands from "$commands";
import log from "$logger";
import shutdown from "@libs/shutdown";

// create a new client
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

//* Register events to client
log.debug("Registering events...");
events.forEach((event) => {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	log.debug(`Registered event "${event.name}".`);
});
log.info("Registered events with client.");

process.on("SIGTERM", () => shutdown());
process.on("SIGBREAK", () => shutdown());
process.on("SIGINT", () => shutdown());

//* Register commands
log.debug("Registering application commands...");
const register: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
commands.forEach((command) => {
	register.push(command.data.toJSON());
	log.debug(`Recognized command "${command.name}".`);
});
const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);
rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), {
	body: register
})
	.then(() => log.info("Registered application commands to Discord."))
	.catch((error) =>
		log.warn(
			"Failed to register application commands. The bot may not function properly if the commands were altered.",
			error
		)
	);

//* Login
log.info("Logging in...");
client.login(process.env.DISCORD_TOKEN).catch((error) => {
	log.fatal(error, "Login failed.");
	process.exit(1);
});

//* Start cron tasks
log.info("Starting cron tasts...");
birthdayCron.start();

//* Export client to be used elsewhere
export default client;
