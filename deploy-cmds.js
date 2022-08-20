//configure enviroment variables
require('dotenv').config();

//tell the user that the process has begun
console.log('Prepareing...');

//create needed variables
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./configuration/config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//tell the user the commands are being retrieved
console.log('Retrieving application commands from commands folder...')

//get the commands
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

//tell the user the commands are being registered
console.log('Registering application commands...')

//publish the commands to Discord
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands!'))
	.catch(console.error);
