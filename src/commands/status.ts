import { defaultEmbedColor } from "$config";
import { checkBlockNew } from "@database/state";
import { alterReply, replyString } from "@libs/reply";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  bold,
  EmbedBuilder,
  ColorResolvable,
  italic
} from "discord.js";

export default {
  name: "status",
  global: true,
  dev: false,
  ephemeral: false,
  defer: false,
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get the status of the bot.")
    .setDMPermission(true),

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await replyString(
      interaction,
      this.ephemeral,
      `${bold(
        "Ping!"
      )}\nYour message got through, fetching status and latency data now, please wait...`
    );

    const embed = new EmbedBuilder()
      .setTitle("Status and Latency Data")
      .setColor(defaultEmbedColor as ColorResolvable)
      .addFields(
        {
          name: "Bot Status",
          value: (await checkBlockNew())
            ? "🔴 - Not Accepting new Requests!"
            : "🟢 - Online"
        },
        {
          name: "Database Status",
          value: `🔴 - Offline (${italic("feature unfinished")})`
        },
        {
          name: "Functionality",
          value: (await checkBlockNew())
            ? `🔴 - None (${italic("all systems disabled")})`
            : `🟡 - Partial (${italic("database offline")})`
        },
        {
          name: "Websocket Hearbeat",
          value: `${interaction.client.ws.ping}ms`
        },
        {
          name: "Roundtrip Latency",
          value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`
        }
      );

    alterReply(interaction, bold("Ping!"), embed);
  }
};
