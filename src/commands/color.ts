//libraries
import {
	ChatInputCommandInteraction,
	GuildMember,
	Role,
	SlashCommandBuilder
} from "discord.js";
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
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("update")
				.setDescription("Updates or creates your color.")
				.addIntegerOption((option) => {
					option
						.setName("color")
						.setDescription("The color you wish to have.")
						.setRequired(true);

					userColors.forEach((color, index) => {
						if (index == 24) return;
						option.addChoices({ name: color.name, value: index });
					});

					return option;
				})
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
	async execute(interaction: ChatInputCommandInteraction) {
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

				if (interaction.guild == null) {
					await interaction.editReply(
						"Color was successfully updated in database, not accross servers. Use color refresh to update the roles in a server."
					);
					log.warn(
						`${interaction.user.tag} has updated their color in their DMs. Their roles weren't updated.`
					);
					break;
				}

				//get server colors
				const colors = (await getGuildColor(
					interaction.guild.id as string
				)) as Array<string>;
				if (colors == null) {
					await interaction.editReply(
						"This guild does not have the color command enabled."
					);
					log.warn(
						`${interaction.user.tag} has failed to refresh their color as the guild had the feature disabled.`
					);
					break;
				}

				//get the user
				const member = interaction.guild.members.cache.get(
					interaction.user.id
				) as GuildMember;

				//remove old color roles
				const oldRole = member.roles.cache.get(colors[userColor]);
				if (oldRole) member.roles.remove(oldRole);

				//get color role and give it to user
				if (newColor != 0) {
					const role = interaction.guild.roles.cache.get(
						colors[newColor]
					) as Role;
					member.roles.add(role);
				}

				//tell user the action was successful
				await interaction.editReply(
					"Your color was successfully updated in database and refreshed in this guild."
				);
				log.info(`${interaction.user.tag} has updated their color.`);

				break;
			}

			case "refresh": {
				if (interaction.guild == null) {
					await interaction.editReply(
						"Could not refresh your color as this command was run in the DMs."
					);
					log.warn(
						`${interaction.user.tag} has attempted to refresh their color in their DMs.`
					);
					break;
				}

				//get server colors
				const colors = (await getGuildColor(
					interaction.guild.id as string
				)) as Array<string>;
				if (colors == null) {
					await interaction.editReply(
						"This guild does not have the color command enabled."
					);
					log.warn(
						`${interaction.user.tag} has failed to refresh their color as the guild had the feature disabled.`
					);
					break;
				}

				//get the user
				const member = interaction.guild.members.cache.get(
					interaction.user.id
				) as GuildMember;

				//remove old color roles
				const oldRoles = member.roles.cache.filter((role) =>
					colors.includes(role.id)
				);
				oldRoles.forEach((role) => member.roles.remove(role));

				//get color role and give it to user
				if (userColor != 0) {
					const role = interaction.guild.roles.cache.get(
						colors[userColor]
					) as Role;
					member.roles.add(role);
				}

				//tell user the action was successful
				await interaction.editReply(
					"Your color was successfully updated in database and refreshed in this guild."
				);
				log.info(`${interaction.user.tag} has updated their color.`);

				break;
			}
		}
	}
};
