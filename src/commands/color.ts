//libraries
import { CommandInteraction, Role, SlashCommandBuilder } from "discord.js";
import { userDBEntry } from "../types";
import { getUser, updateUserColor } from "../functions/userDatabase";
import { getGuildColor } from "../functions/guildDatabase";
import { userColors } from "../config.json";
import log from "../logger";

//export command
export = {
	name: "color",
	ephemeral: true,

	//command information
	data: new SlashCommandBuilder()
		.setName("color")
		.setDescription("Use this command to set your own custom color.")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("update")
				.setDescription("Updates or creates your color.")
				.addIntegerOption((option) =>
					option
						.setName("color")
						.setDescription("The color you wish to have.")
						.setRequired(true)
						.addChoices(
							{ name: "None", value: 0 },
							{ name: "MP Blue", value: 1 },
							{ name: "Marki Pink", value: 2 },
							{ name: "Gljue Purple", value: 3 },
							{ name: "Potato Green", value: 4 },
							{ name: "Cloud Blue", value: 5 },
							{ name: "Rikaphu Red", value: 6 },
							{ name: "Ylliada Green", value: 7 }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("view")
				.setDescription("Check which color you have.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("refresh")
				.setDescription(
					"Re-creates your color from the database if a moderator removed it."
				)
		),

	//command code
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		//userDB entry on user
		const potentialDBEntry = await getUser(interaction.user.id);
		if (potentialDBEntry == null) {
			await interaction.editReply(
				"Your database entry has not been found, please create one using `/database create`."
			);
			log.warn(
				`${interaction.user.tag} failed to update his color, due to not having a userDB entry.`
			);
			return;
		}
		const dbEntry = potentialDBEntry as userDBEntry;

		//let user view their color, even if /color is disabled
		if (interaction.options.getSubcommand() == "view") {
			await interaction.editReply(
				`Your color is ${
					userColors[dbEntry.color].name
				} and the HEX-CODE is ${userColors[dbEntry.color].code}.`
			);
			log.info(`${interaction.user.tag} has viewed their color.`);
			return;
		}

		//get server colors
		const colors = (await getGuildColor(
			interaction.guildId as string
		)) as Array<string>;
		if (colors == null) {
			await interaction.editReply(
				"This server doesn't have the `/color` command enabled."
			);
			log.warn(
				`${interaction.user.tag} failed to use the color command as the guild has it disabled.`
			);
			return;
		}

		switch (interaction.options.getSubcommand()) {
			case "update": {
				//get new color
				const newColor = interaction.options.getInteger(
					"color"
				) as number;

				//update user color
				await updateUserColor(interaction.user.id, newColor);

				//get the user
				const member = interaction.guild?.members.cache.find(
					(member) => member.id == interaction.user.id
				);

				//get color role and give it to user
				if (newColor != 0) {
					const role = interaction.guild?.roles.cache.find(
						(role) => role.id == colors[newColor]
					) as Role;
					member?.roles.add(role);
				}

				//remove old color roles
				if (
					member?.roles.cache.some(
						(role) => role.id == colors[dbEntry.color]
					)
				) {
					const oldRole = interaction.guild?.roles.cache.find(
						(role) => role.id == colors[dbEntry.color]
					) as Role;
					member.roles.remove(oldRole);
				}

				//tell user the action was successful
				await interaction.editReply(
					"Your color was successfully updated!"
				);
				log.info(
					`${interaction.user.tag} has updated their new color.`
				);

				break;
			}

			case "refresh": {
				//get color role
				const role = interaction.guild?.roles.cache.find(
					(role) => role.id == colors[dbEntry.color]
				) as Role;

				//give the user the color
				const member = interaction.guild?.members.cache.find(
					(member) => member.id == interaction.user.id
				);
				member?.roles.add(role);

				//remove old color roles
				if (
					member?.roles.cache.some(
						(role) => role.id == colors[dbEntry.color]
					)
				) {
					const oldRole = interaction.guild?.roles.cache.find(
						(role) => role.id == colors[dbEntry.color]
					) as Role;
					member.roles.remove(oldRole);
				}

				//tell user the action was successful
				await interaction.editReply(
					"Your color was successfully refreshed!"
				);
				log.info(`${interaction.user.tag} has refreshed their color.`);

				break;
			}
		}
	}
};
