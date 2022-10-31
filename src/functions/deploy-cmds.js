//create needed variables
const { REST, Routes } = require('discord.js');
const { clientId } = require('../configuration/config.json');
const fs = require('node:fs');
const path = require('node:path');
const log = require('../logger.js');

module.exports = {
	name: 'deploy-cmds',
	execute(){
		//tell the user that the process has begun
		log.info('Preparering to register commands...');

		//prep to get the commands
		const commands = [];
		const commandsPath = path.resolve(__dirname, '../commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		//tell the user the commands are being retrieved
		log.info('Retrieving application commands from commands folder...');

		//get the commands
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			commands.push(command.data.toJSON());
		}

		//tell the user the commands are being registered
		log.info('Registering application commands...');

		//publish the commands to Discord
		const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

		rest.put(Routes.applicationCommands(clientId), { body: commands })
			.then(() => log.info('Successfully registered application commands!'))
			.catch(console.error());
	}
}
