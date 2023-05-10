//libraries
import { CommandInteraction, Role, SlashCommandBuilder } from "discord.js";
import { updateUserColor, getUserColor, getGuildColor } from "$lib/databaseAPI";
import { userColors } from "$config";
import log from "$lib/logger";

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
							{ name: userColors[0].name, value: 0 },
							{ name: userColors[1].name, value: 1 },
							{ name: userColors[2].name, value: 2 },
							{ name: userColors[3].name, value: 3 },
							{ name: userColors[4].name, value: 4 },
							{ name: userColors[5].name, value: 5 },
							{ name: userColors[6].name, value: 6 },
							{ name: userColors[7].name, value: 7 },
							{ name: userColors[8].name, value: 8 },
							{ name: userColors[9].name, value: 9 },
							{ name: userColors[10].name, value: 10 },
							{ name: userColors[11].name, value: 11 },
							{ name: userColors[12].name, value: 12 },
							{ name: userColors[13].name, value: 13 },
							{ name: userColors[14].name, value: 14 },
							{ name: userColors[15].name, value: 15 },
							{ name: userColors[16].name, value: 16 },
							{ name: userColors[17].name, value: 17 }
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

		//run code depending on subcommand
		switch (interaction.options.getSubcommand()) {
			case "view": {
				await interaction.editReply(
					`Your color is **${userColors[userColor].name}** and the HEX-CODE is \`${userColors[userColor].code}\`.`
				);
				log.info(`${interaction.user.tag} has viewed their color.`);

				break;
			}

			case "update": {
				//get new color
				const newColor = interaction.options.getInteger(
					"color"
				) as number;

				//update user color
				await updateUserColor(interaction.user.id, newColor);

				//get server colors
				const colors = (await getGuildColor(
					interaction.guildId as string
				)) as Array<string>;
				if (colors == null) {
					await interaction.editReply(
						"This server doesn't have the `/color` command enabled therefore your color could not be added however changes were recoreded to the database."
					);
					log.warn(
						`${interaction.user.tag} failed to use the color command as the guild has it disabled.`
					);
					return;
				}

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
