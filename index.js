//tell the user that the bot is preparing
console.log('Preparing for bot activation...');

// Require the necessary libraries
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { verificationRoleId } = require('./config.json');
const { token } = require('./token.json');

// Create a new client instance
console.log('Creating new client instance...');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], disableEveryone: false});
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once('ready', () => {
	client.user.setPresence({ activities: [{ name: 'Poll Command Update!'}], status: 'online' });
	console.log('The bot is ready!');
});

// Login to Discord with your client's token
console.log('Logging in...');
client.login(token);

//add the commands to the client command collection
console.log('Adding commands to the clients command collection...');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
console.log('Preforming final preparations...');

//code to execute when a command is run
client.on('interactionCreate', async interaction => {
	//make sure the interaction is a command
	if (!interaction.isCommand()) return;
	
	//get the command name
	const command = client.commands.get(interaction.commandName);

	//if there is no command name return
	if (!command) return;

	//if it's the ping command execute it's code and return
	if(interaction.commandName === 'maintenance'){
		if (interaction.options.getSubcommand() === 'ping'){
			//get latency
			const apiLatency = Math.round(client.ws.ping);
			const botLatency = Math.floor(Date.now() - interaction.createdAt);

			//respond to the user
			await interaction.reply(`**Current Latency**\nAPI Latency is around ${apiLatency}ms.\nBot Latency is around ${botLatency}ms.`);

			//log it to the command console
			console.log(`API Latency is around ${apiLatency}ms. Bot Latency is around ${botLatency}ms.`);

			//end command execution
			return;
		}
	}

	//check the commands folder for the command and run it's code
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
	}
});

//code to execute when a button is pressed
client.on('interactionCreate', interaction => {
	//if not button return
	if (!interaction.isButton()) return;

	//execute code depending on the button that was pressed
	if (interaction.customId === 'verification'){
		//find the role needed
		const role = interaction.guild.roles.cache.find(role => role.id === verificationRoleId);

		//add the role to the user
		interaction.member.roles.add(role);

		//log it to the console
		console.log(`${interaction.user.tag} has been verified.`);

		//reply to the user
		interaction.reply({content: 'Roles succesfully updated.', ephemeral: true});
	}
});
