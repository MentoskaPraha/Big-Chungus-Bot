//create needed variables
import { REST, Routes } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import log from "../logger";
const { clientId } = require("../configuration/config.json");

export = {
	name: "deploy-cmds",
	async execute(){
		//tell the user that the process has begun
		log.info("Preparering to register commands...");

		//prep to get the commands
		const commands = [];
		const commandsPath = path.resolve(__dirname, "../commands");
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

		//tell the user the commands are being retrieved
		log.info("Retrieving application commands from commands folder...");

		//get the commands
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			commands.push(command.data.toJSON());
		}

		//tell the user the commands are being registered
		log.info("Registering application commands...");

		//publish the commands to Discord
		const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

		rest.put(Routes.applicationCommands(clientId), { body: commands })
			.then(() => log.info("Successfully registered application commands!"))
			.catch(log.error);
	}
}
