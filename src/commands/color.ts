//libraries
import { CommandInteraction, Role, SlashCommandBuilder } from "discord.js";
import { updateUserColor, getUserColor } from "../functions/databaseAPI";
import { getGuildColor } from "../functions/databaseAPI";
import { userColors } from "../config.json";
import log from "../logger";

//export command
export = {
	name: "color",

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
							{ name: "Ylliada Green", value: 7 },
							{ name: "Passionate Red", value: 8 },
							{ name: "Oránž", value: 9 },
							{ name: "Crystal Blue", value: 10 },
							{ name: "Grass Green", value: 11 },
							{ name: "Navy Blue", value: 12 },
							{ name: "Foggy Cyan", value: 13 },
							{ name: "Dandelion Yellow", value: 14 },
							{ name: "Ghostly White", value: 15 },
							{ name: "Bullet Silver", value: 16 },
							{ name: "Wine Maroon", value: 17 }
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
		await interaction.deferReply({ ephemeral: true });

		//userDB entry on user
		const userColor = await getUserColor(interaction.user.id);

		//let user view their color, even if /color is disabled
		if (interaction.options.getSubcommand() == "view") {
			await interaction.editReply(
				`Your color is **${userColors[userColor].name}** and the HEX-CODE is \`${userColors[userColor].code}\`.`
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
						(role) => role.id == colors[userColor]
					)
				) {
					const oldRole = interaction.guild?.roles.cache.find(
						(role) => role.id == colors[userColor]
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
					(role) => role.id == colors[userColor]
				) as Role;

				//give the user the color
				const member = interaction.guild?.members.cache.find(
					(member) => member.id == interaction.user.id
				);
				member?.roles.add(role);

				//remove old color roles
				if (
					member?.roles.cache.some(
						(role) => role.id == colors[userColor]
					)
				) {
					const oldRole = interaction.guild?.roles.cache.find(
						(role) => role.id == colors[userColor]
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
