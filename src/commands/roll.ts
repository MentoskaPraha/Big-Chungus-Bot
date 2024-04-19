import { replyEmbed } from "@libs/reply";
import { defaultEmbedColor } from "$config";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ColorResolvable
} from "discord.js";

/**
 * Rolls the specified dice.
 * @param num The number of dice to roll.
 * @param sides The number of sides of the dice.
 * @returns A string with the results of the roll/s.
 */
function roll(num: number, sides: number) {
  let results = "";
  for (let i = 0; i < num; i++) {
    results += `${Math.floor(Math.random() * sides + 1)}, `;
  }
  results = results.slice(0, -2);

  return results;
}

export default {
  name: "roll",
  global: true,
  dev: false,
  ephemeral: false,
  defer: false,
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll some dice.")
    .setDMPermission(true)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("all")
        .setDescription("Rolls all the dice types.")
        .addNumberOption((option) =>
          option
            .setName("dice_num")
            .setDescription("The number of dice that should be rolled.")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(99)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("d100")
        .setDescription("Rolls a 100 sided dice.")
        .addNumberOption((option) =>
          option
            .setName("dice_num")
            .setDescription("The number of dice that should be rolled.")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(99)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("d20")
        .setDescription("Rolls a 20 sided dice.")
        .addNumberOption((option) =>
          option
            .setName("dice_num")
            .setDescription("The number of dice that should be rolled.")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(99)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("d12")
        .setDescription("Rolls a 12 sided dice.")
        .addNumberOption((option) =>
          option
            .setName("dice_num")
            .setDescription("The number of dice that should be rolled.")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(99)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("d10")
        .setDescription("Rolls a 10 sided dice.")
        .addNumberOption((option) =>
          option
            .setName("dice_num")
            .setDescription("The number of dice that should be rolled.")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(99)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("d8")
        .setDescription("Rolls a 8 sided dice.")
        .addNumberOption((option) =>
          option
            .setName("dice_num")
            .setDescription("The number of dice that should be rolled.")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(99)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("d6")
        .setDescription("Rolls a 6 sided dice.")
        .addNumberOption((option) =>
          option
            .setName("dice_num")
            .setDescription("The number of dice that should be rolled.")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(99)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("d4")
        .setDescription("Rolls a 4 sided dice.")
        .addNumberOption((option) =>
          option
            .setName("dice_num")
            .setDescription("The number of dice that should be rolled.")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(99)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    let diceNum = interaction.options.getNumber("dice_num");
    if (diceNum == null) diceNum = 1;

    const embed = new EmbedBuilder()
      .setTitle("Dice Roller Results")
      .setDescription("The results of your use of the dice roller.")
      .setColor(defaultEmbedColor as ColorResolvable);

    switch (interaction.options.getSubcommand()) {
      case "all": {
        embed.addFields(
          {
            name: "d100",
            value: roll(diceNum, 100)
          },
          {
            name: "d20",
            value: roll(diceNum, 20)
          },
          {
            name: "d12",
            value: roll(diceNum, 12)
          },
          {
            name: "d10",
            value: roll(diceNum, 10)
          },
          {
            name: "d8",
            value: roll(diceNum, 8)
          },
          {
            name: "d6",
            value: roll(diceNum, 6)
          },
          {
            name: "d4",
            value: roll(diceNum, 4)
          }
        );
        break;
      }
      case "d100": {
        embed.setTitle(`d100 ${embed.data.title}`);
        embed.setDescription(roll(diceNum, 100));
        break;
      }
      case "d20": {
        embed.setTitle(`d20 ${embed.data.title}`);
        embed.setDescription(roll(diceNum, 20));
        break;
      }
      case "d12": {
        embed.setTitle(`d12 ${embed.data.title}`);
        embed.setDescription(roll(diceNum, 12));
        break;
      }
      case "d10": {
        embed.setTitle(`d10 ${embed.data.title}`);
        embed.setDescription(roll(diceNum, 10));
        break;
      }
      case "d8": {
        embed.setTitle(`d8 ${embed.data.title}`);
        embed.setDescription(roll(diceNum, 8));
        break;
      }
      case "d6": {
        embed.setTitle(`d6 ${embed.data.title}`);
        embed.setDescription(roll(diceNum, 6));
        break;
      }
      case "d4": {
        embed.setTitle(`d4 ${embed.data.title}`);
        embed.setDescription(roll(diceNum, 4));
        break;
      }
    }

    replyEmbed(interaction, this.ephemeral, embed);
  }
};
