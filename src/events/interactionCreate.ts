import log from "@libs/logs";
import globalCommands from "commands/_register";
import { Events, BaseInteraction } from "discord.js";
import { replyFailure } from "@libs/reply";

export default {
	name: Events.InteractionCreate,
	once: false,

	async execute(interaction: BaseInteraction) {
		log.eventRecieved(Events.InteractionCreate, interaction.user.tag);

		if (interaction.isChatInputCommand()) {
			const command = globalCommands.get(interaction.commandName);
			if (!command) {
				replyFailure(interaction, "The command was not found.").then(
					() => {
						log.warn(
							`The command ${interaction.commandName} was not found!`
						);
					}
				);
				return;
			}

			if (command.defer)
				await interaction.deferReply({ ephemeral: command.ephemeral });

			command
				.execute(interaction)
				.then(() => {
					log.commandExecuted(command.name, interaction.user.tag);
				})
				.catch((error: Error) => {
					replyFailure(interaction, error.message);
					log.error(
						error,
						`Command "${command.name}" ran by ${interaction.user.tag} failed to run.`
					);
				});
			return;
		}

		log.debug(
			`Event "${Events.InteractionCreate}" from ${interaction.user.tag} was ignored.`
		);
	}
};
