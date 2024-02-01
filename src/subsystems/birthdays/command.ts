import { getUserBirthday, setUserBirthday } from "@database/users";
import { replyFailure, replySuccess } from "@libs/reply";
import dayjs from "dayjs";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
	name: "birthday",
	global: true,
	dev: false,
	ephemeral: true,
	defer: false,
	data: new SlashCommandBuilder()
		.setName("birthday")
		.setDescription(
			"Set your birthday so the bot remembers it and announces it."
		)
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("set")
				.setDescription(
					"Set a new birthday. Will override the previous."
				)
				.addIntegerOption((option) =>
					option
						.setName("day")
						.setDescription("The day of your birthday.")
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(31)
				)
				.addIntegerOption((option) =>
					option
						.setName("month")
						.setDescription("The month of your birthday.")
						.setRequired(true)
						.setChoices(
							{
								name: "January",
								value: 1
							},
							{
								name: "February",
								value: 2
							},
							{
								name: "March",
								value: 3
							},
							{
								name: "April",
								value: 4
							},
							{
								name: "May",
								value: 5
							},
							{
								name: "June",
								value: 6
							},
							{
								name: "July",
								value: 7
							},
							{
								name: "August",
								value: 8
							},
							{
								name: "September",
								value: 9
							},
							{
								name: "October",
								value: 10
							},
							{
								name: "November",
								value: 11
							},
							{
								name: "December",
								value: 12
							}
						)
				)
				.addIntegerOption((option) =>
					option
						.setName("year")
						.setDescription("The year of your birthday.")
						.setRequired(true)
						.setMinValue(
							new Date(Date.now()).getUTCFullYear() - 100
						)
						.setMaxValue(new Date(Date.now()).getUTCFullYear())
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("get")
				.setDescription("View your current birthday.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("remove")
				.setDescription("Remove your current birthday.")
		),
	async execute(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case "set": {
				const day = interaction.options.getInteger("day", true);
				const month = interaction.options.getInteger("month", true);
				const year = interaction.options.getInteger("year", true);
				const date = dayjs(`${year}-${month}-${day}`);

				await setUserBirthday(interaction.user.id, date.toDate());

				replySuccess(
					interaction,
					this.ephemeral,
					`Your birthday record has been set to: ${date.format(
						"DD MMMM YYYY"
					)}`
				);
				break;
			}

			case "get": {
				const birthday = await getUserBirthday(interaction.user.id);
				if (birthday == undefined) {
					replyFailure(
						interaction,
						"You do not have a birthday on record."
					);
				} else {
					replySuccess(
						interaction,
						this.ephemeral,
						`Your birthday day on record is: ${dayjs(
							birthday
						).format("DD MMMM YYYY")}`
					);
				}
				break;
			}

			case "remove": {
				await setUserBirthday(interaction.user.id);
				replySuccess(
					interaction,
					this.ephemeral,
					"The bot will no longer announce your birthday."
				);
				break;
			}
		}
	}
};
