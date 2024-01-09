import { replyString, replyStringEmbed } from "@libs/reply";
import createEmbed from "@libs/utils/embedBuilder";
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	bold
} from "discord.js";
import emojiRegex from "emoji-regex";

export default {
	name: "poll",
	global: true,
	dev: false,
	ephemeral: false,
	defer: false,
	data: new SlashCommandBuilder()
		.setName("poll")
		.setDescription(
			"Create a simple reaction poll. Works exactly like Simple Poll."
		)
		.setDMPermission(true)
		.addStringOption((option) =>
			option
				.setName("question")
				.setDescription("The question you want answered by this poll.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("choice_1")
				.setDescription("The 1st answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_2")
				.setDescription("The 2nd answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_3")
				.setDescription("The 3rd answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_4")
				.setDescription("The 4th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_5")
				.setDescription("The 5th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_6")
				.setDescription("The 6th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_7")
				.setDescription("The 7th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_8")
				.setDescription("The 8th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_9")
				.setDescription("The 9th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_10")
				.setDescription("The 10th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_11")
				.setDescription("The 11th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_12")
				.setDescription("The 12th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_13")
				.setDescription("The 13th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_14")
				.setDescription("The 14th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_15")
				.setDescription("The 15th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_16")
				.setDescription("The 16th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_17")
				.setDescription("The 17th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_18")
				.setDescription("The 18th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_19")
				.setDescription("The 19th answer to your question.")
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("choice_20")
				.setDescription("The 20th answer to your question.")
				.setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		//* Get question and responses
		const question = interaction.options.getString("question") as string;
		const choices: string[] = [];
		for (let i = 1; i <= 20; i++) {
			const choice = interaction.options.getString(`choice_${i}`);
			if (choice == null) continue;
			choices.push(choice);
		}

		//* No choices response
		if (choices.length == 0) {
			await replyString(
				interaction,
				this.ephemeral,
				`📊 ${bold(question)}`
			);
			const message = await interaction.fetchReply();
			await message.react("👍");
			await message.react("👎");
			return;
		}

		//* More than one choice response
		const defaultEmojis = [
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

		const emojis: string[] = [];
		let response = "";

		choices.forEach((choice, index) => {
			const emojisInChoice = choice.match(
				new RegExp(`${/<a?:.+?:\d+>/gu.source}|${emojiRegex().source}`)
			);

			if (emojisInChoice == null) {
				emojis.push(defaultEmojis[index]);
			} else {
				let customEmoji: string;
				if (emojis.includes(emojisInChoice[0])) {
					customEmoji = defaultEmojis[index];
				} else {
					customEmoji = emojisInChoice[0];
					choice = choice.replace(customEmoji, "").trim();
				}

				emojis.push(customEmoji);
			}
			response += `${emojis[index]} ${choice}\n`;
		});

		const embed = createEmbed(null, response);

		await replyStringEmbed(
			interaction,
			this.ephemeral,
			`📊 ${question}`,
			embed
		);
		const message = await interaction.fetchReply();
		emojis.forEach(async (emoji) => {
			await message.react(emoji);
		});
	}
};
