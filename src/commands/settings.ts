import { setGuildBirthdayChannel } from "@database/guilds";
import { replyFailure, replySuccess } from "@libs/reply";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from "discord.js";

export default {
  name: "settings",
  global: true,
  dev: false,
  ephemeral: true,
  defer: false,
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Alter the bots server settings.")
    .setDMPermission(false)
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("birthday-announcements")
        .setDescription(
          "Enable or disable if the bot should announce user's birthday."
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("enable")
            .setDescription("Enable birthday announcements.")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription(
                  "The channel the announcements will be sent into."
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("disable")
            .setDescription("Disables birthday announcements.")
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (member == undefined) {
      replyFailure(
        interaction,
        "Somehow you aren't in the guild you ran this command in."
      );
      return;
    }

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      replyFailure(
        interaction,
        "You do not have the required permissions to run this command!"
      );
      return;
    }

    switch (interaction.options.getSubcommandGroup()) {
      case "birthday-announcements": {
        switch (interaction.options.getSubcommand()) {
          case "enable": {
            const channel = interaction.options.getChannel("channel", true);

            await setGuildBirthdayChannel(
              interaction.guildId as string,
              channel.id
            );
            replySuccess(interaction);

            break;
          }
          case "disable": {
            await setGuildBirthdayChannel(interaction.guildId as string);
            replySuccess(interaction);

            break;
          }
        }

        break;
      }
    }
  }
};
