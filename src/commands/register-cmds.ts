import log from "@libs/logs";
import commands from "$commands";
import {
	ChatInputCommandInteraction,
	REST,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes,
	SlashCommandBuilder
} from "discord.js";

export default {
	name: "register-cmds",
	global: true,
	dev: true,
	ephemeral: true,
	defer: true,
	data: new SlashCommandBuilder()
		.setName("register-cmds")
		.setDescription("Runs the command registration sequence again.")
		.setDMPermission(true),
	async execute(interaction: ChatInputCommandInteraction) {
		log.debug(
			`Registering application commands from "${interaction.commandName}" command ran by ${interaction.user.tag}...`
		);

		const register: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
		commands.forEach((command) => {
			register.push(command.data.toJSON());
			log.debug(`Recognized command "${command.name}".`);
		});

		const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);
		await rest.put(
			Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
			{
				body: register
			}
		);

		log.info(
			`Application commands re-registered by ${interaction.user.tag} using "${interaction.commandName}" command.`
		);
	}
};
