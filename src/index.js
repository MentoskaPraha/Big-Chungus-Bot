// Require the necessary libraries
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const log = require('./logger.js');

//tell the user that the bot is preparing
log.info("Preparing for bot activation...");

// Create a new client instance
log.info('Creating new client instance...');
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildScheduledEvents
	], 
	disableEveryone: false
});
client.commands = new Collection();
//client.otherInteractions = new Collection();
client.functions = new Collection();

//add the commands to the client command collection
log.info('Adding commands to the clients command collection...');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

//add events to the client event collections
log.info('Adding events to the client event collection...');
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//add other interactions to the client other interaction collection
/*log.info('Adding other interaction to the clients other interaction collection...');
const interactionPath = path.join(__dirname, 'interactions');
const interactionFiles = fs.readdirSync(interactionPath).filter(file => file.endsWith('.js'));

for (const file of interactionFiles) {
	const filePath = path.join(interactionPath, file);
	const interaction = require(filePath);
	client.otherInteractions.set(interaction.name, interaction);
}*/

//add functions to the client function collection
log.info('Adding functions to the clients function collection...');
const functionPath = path.join(__dirname, 'functions');
const functionFiles = fs.readdirSync(functionPath).filter(file => file.endsWith('.js'));

for (const file of functionFiles) {
	const filePath = path.join(functionPath, file);
	const botFunction = require(filePath);
	client.functions.set(botFunction.name, botFunction);
}

//let the user know that the bot is almost ready
log.info('Preforming final preparations...');
client.functions.get('userDB').syncDB();

//register the commands
const registerCmds = client.functions.get('deploy-cmds');
try {
	await registerCmds.execute();
} catch (error) {
	console.error(error);
}

// Login to Discord with your client's token
log.info('Logging in...');
client.login(process.env.DISCORD_BOT_TOKEN);

// When the client is ready, run this code (only once)
client.once('ready', () => {
	client.user.setPresence({ activities: [{ name: 'The Big Chungus Relegion', type: ActivityType.Watching}], status: 'online' });
	log.info('The bot is ready!');
});
