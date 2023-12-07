import log from "@libs/logs";
import globalCommands from "$globalCommands";
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
				replyFailure(
					interaction,
					"The command was not found.",
					true
				).then(() => {
					log.warn(
						`The command ${interaction.commandName} was not found!`
					);
				});
				return;
			}

			await command.execute(interaction);
			log.commandExecuted(command.name, interaction.user.tag);
		}

		log.eventExecuted(Events.InteractionCreate, interaction.user.tag);
	}
};
