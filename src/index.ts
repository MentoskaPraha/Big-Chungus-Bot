import {
	Client,
	GatewayIntentBits,
	REST,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes
} from "discord.js";
import globalEvents from "$globalEvents";
import globalCommands from "$globalCommands";
import log from "$logger";

// create a new client
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

//* Register events to client
log.debug("Registering events...");
globalEvents.forEach((event) => {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	log.debug(`Registered event "${event.name}".`);
});
log.info("Registered events with client.");

// TODO Connect to database

// TODO add SIGTERM, SIGINT and SIGBREAK handling

//* Register commands
log.debug("Registering application commands...");
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
globalCommands.forEach((command) => {
	commands.push(command.data.toJSON());
	log.debug(`Recognized command "${command.name}".`);
});
const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);
rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), {
	body: commands
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
