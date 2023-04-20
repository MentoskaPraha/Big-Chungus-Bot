//dependencies
import {
	SlashCommandBuilder,
	EmbedBuilder,
	CommandInteraction,
	ColorResolvable
} from "discord.js";
import { getUserTitle } from "../functions/userDatabase";
import log from "../logger";
import { pollEmbedColor } from "../config.json";

//command
export = {
	name: "poll",

	//command data
	data: new SlashCommandBuilder()
		.setName("poll")
		.setDescription("Creates a poll.")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("yes-or-no")
				.setDescription("Creates a yes or no poll.")
				.addStringOption((option) =>
					option
						.setName("question")
						.setDescription("The question you will ask.")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("multi-choice")
				.setDescription("Creates a poll with up to 20 choices.")
				.addStringOption((option) =>
					option
						.setName("question")
						.setDescription("The question you will ask.")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("answer_1")
						.setDescription("The 1st answer to your question.")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("answer_2")
						.setDescription("The 2nd answer to your question.")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("answer_3")
						.setDescription("The 3rd answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_4")
						.setDescription("The 4th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_5")
						.setDescription("The 5th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_6")
						.setDescription("The 6th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_7")
						.setDescription("The 7th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_8")
						.setDescription("The 8th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_9")
						.setDescription("The 9th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_10")
						.setDescription("The 10th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_11")
						.setDescription("The 11th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_12")
						.setDescription("The 12th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_13")
						.setDescription("The 13th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_14")
						.setDescription("The 14th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_15")
						.setDescription("The 15th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_16")
						.setDescription("The 16th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_17")
						.setDescription("The 17th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_18")
						.setDescription("The 18th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_19")
						.setDescription("The 19th answer to your question.")
						.setRequired(false)
				)
				.addStringOption((option) =>
					option
						.setName("answer_20")
						.setDescription("The 20th answer to your question.")
						.setRequired(false)
				)
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		switch (interaction.options.getSubcommand()) {
			case "yes-or-no": {
				//get options
				const question = interaction.options.getString("question");

				//get emojis
				const emojis = ["✅", "❌"];

				//create embed
				const embed = new EmbedBuilder()
					.setColor(pollEmbedColor as ColorResolvable)
					.setTitle(question)
					.setDescription(`${emojis[0]} Yes\n\n${emojis[1]} No`);

				//send poll
				await interaction.reply({
					content: `Poll by ${await getUserTitle(
						interaction.user.id
					)} ${interaction.user.username}.`,
					embeds: [embed]
				});

				//add reactions
				const message = await interaction.fetchReply();
				await message.react(`${emojis[0]}`);
				await message.react(`${emojis[1]}`);

				log.info(`${interaction.user.tag} has created a new poll.`);
				break;
			}

			case "multi-choice": {
				//get command options
				const question = interaction.options.getString("question");
				const answers = [];
				for (
					let i = 1;
					interaction.options.getString("answer_" + i) !== null;
					i++
				) {
					answers.push(interaction.options.getString("answer_" + i));
				}
				answers.push(null);

				//get emojis
				const emojis = [
					"🇦",
					"🇧",
					"🇨",
					"🇩",
					"🇪",
					"🇫",
					"🇬",
					"🇭",
					"🇮",
					"🇯",
					"🇰",
					"🇱",
					"🇲",
					"🇳",
					"🇴",
					"🇵",
					"🇶",
					"🇷",
					"🇸",
					"🇹"
				];

				//create embed
				let embedDescription = `${emojis[0]} ${answers[0]}`;
				for (let i = 1; answers[i] != null; i++) {
					embedDescription += `\n\n${emojis[i]} ${answers[i]}`;
				}

				const embed = new EmbedBuilder()
					.setColor(pollEmbedColor as ColorResolvable)
					.setTitle(question)
					.setDescription(embedDescription);

				//send poll
				await interaction.reply({
					content: `Poll by ${await getUserTitle(
						interaction.user.id
					)} ${interaction.user.username}.`,
					embeds: [embed]
				});

				//add reactions
				const message = await interaction.fetchReply();
				for (let i = 0; answers[i] != null; i++) {
					await message.react(emojis[i]);
				}

				log.info(`${interaction.user.tag} has created a new poll.`);
				break;
			}
		}
	}
};
