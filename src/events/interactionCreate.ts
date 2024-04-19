import log from "$logger";
import globalCommands from "$commands";
import { Events, BaseInteraction } from "discord.js";
import { replyFailure } from "@libs/reply";
import { checkBlockAll, checkBlockNew } from "@database/state";

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction: BaseInteraction) {
    log.eventRecieved(Events.InteractionCreate, interaction.user.tag, "MAIN");

    if (interaction.isChatInputCommand()) {
      // Check whether or not the command should be replied to
      if (
        ((await checkBlockAll()) || (await checkBlockNew())) &&
        !(
          interaction.commandName == "status" ||
          interaction.commandName == "maintenance"
        )
      ) {
        replyFailure(
          interaction,
          "The bot is not accepting requests at the moment, please try again later!"
        );
        log.eventIgnored(
          Events.InteractionCreate,
          interaction.user.tag,
          "MAIN"
        );
        return;
      }

      const command = globalCommands.get(interaction.commandName);
      if (!command) {
        replyFailure(interaction, "The command was not found.").then(() => {
          log.warn(`The command ${interaction.commandName} was not found!`);
        });
        return;
      }

      if (command.defer)
        await interaction.deferReply({ ephemeral: command.ephemeral });

      command
        .execute(interaction)
        .then(() => log.commandExecuted(command.name, interaction.user.tag))
        .catch((error: Error) => {
          replyFailure(interaction, error.message);
          log.error(
            error,
            `Command "${command.name}" ran by ${interaction.user.tag} failed to run.`
          );
        });
      return;
    }

    if (interaction.isAutocomplete()) {
      const command = globalCommands.get(interaction.commandName);

      if (!command) {
        log.warn(`The command ${interaction.commandName} was not found!`);
        return;
      }

      if (command.autocomplete) {
        await command
          .autocomplete(interaction)
          .then(() =>
            log.autocompleteResponded(
              interaction.commandName,
              interaction.user.tag
            )
          )
          .catch((error) =>
            log.error(
              error,
              `An error occured during the autocomplete request for command ${interaction.commandName} by ${interaction.user.tag}.`
            )
          );
      }
      return;
    }

    log.eventIgnored(Events.InteractionCreate, interaction.user.tag, "MAIN");
  }
};
