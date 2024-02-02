import { guildDB, inMemDB, userDB } from "@database";
import { replySuccess } from "@libs/reply";
import log from "$logger";
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	codeBlock,
	inlineCode
} from "discord.js";

export default {
	name: "database",
	global: true,
	dev: true,
	ephemeral: true,
	defer: false,
	data: new SlashCommandBuilder()
		.setName("database")
		.setDescription(
			"Manipulate the database, useful during development, but can break the bot."
		)
		.setDMPermission(true)
		.addSubcommandGroup((subcommandgroup) =>
			subcommandgroup
				.setName("in-memory")
				.setDescription(
					"Manipulate the in memory database, used for storing temp values."
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("set")
						.setDescription("Set a key to a value.")
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
						.addStringOption((option) =>
							option
								.setName("value")
								.setDescription("The new value of the entry.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("get")
						.setDescription("Get the value of a key.")
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("delete")
						.setDescription(
							"Delete a key from the database. WARNING: CAN BREAK THE BOT!"
						)
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("clear")
						.setDescription(
							"Clear the database of all keys. WARNING: WILL BREAK THE BOT!"
						)
				)
		)
		.addSubcommandGroup((subcommandgroup) =>
			subcommandgroup
				.setName("user")
				.setDescription(
					"Manipulate the user database, used for storing user data."
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("set")
						.setDescription("Set a key to a value.")
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
						.addStringOption((option) =>
							option
								.setName("value")
								.setDescription(
									"The new value of the entry. Can be a JSON string."
								)
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("get")
						.setDescription("Get the value of a key.")
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("delete")
						.setDescription("Delete a key from the database.")
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("clear")
						.setDescription("Clear the database of all keys.")
				)
		)
		.addSubcommandGroup((subcommandgroup) =>
			subcommandgroup
				.setName("guild")
				.setDescription(
					"Manipulate the guild database, used for storing guild data."
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("set")
						.setDescription("Set a key to a value.")
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
						.addStringOption((option) =>
							option
								.setName("value")
								.setDescription("The new value of the entry.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("get")
						.setDescription("Get the value of a key.")
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("delete")
						.setDescription("Delete a key from the database.")
						.addStringOption((option) =>
							option
								.setName("key")
								.setDescription("The key of the entry.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("clear")
						.setDescription("Clear the database of all keys.")
				)
		),

	async execute(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommandGroup()) {
			case "in-memory": {
				switch (interaction.options.getSubcommand()) {
					case "set": {
						const key = interaction.options.getString("key", true);
						const value = interaction.options.getString(
							"value",
							true
						);

						await inMemDB.set(key, value);

						log.dbValueManipulated("inMemDB", key, value);
						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} was set to:\n${codeBlock(
								value
							)}.`
						);

						break;
					}
					case "get": {
						const key = interaction.options.getString("key", true);

						const result = await inMemDB.get(key);

						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} is set to:\n${codeBlock(
								result
							)}`
						);

						break;
					}
					case "delete": {
						const key = interaction.options.getString("key", true);

						await inMemDB.delete(key);

						log.dbValueManipulated("inMemDB", key, "DELETED");
						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} was deleted.`
						);

						break;
					}
					case "clear": {
						await inMemDB.clear();

						replySuccess(
							interaction,
							this.ephemeral,
							"This action may result in unintended consequences, such as a crash."
						);

						break;
					}
				}

				break;
			}
			case "user": {
				switch (interaction.options.getSubcommand()) {
					case "set": {
						const key = interaction.options.getString("key", true);
						const value = interaction.options.getString(
							"value",
							true
						);

						await userDB.set(key, value);

						log.dbValueManipulated("userDB", key, value);
						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} was set to:\n${codeBlock(
								value
							)}.`
						);

						break;
					}
					case "get": {
						const key = interaction.options.getString("key", true);

						const result = await userDB.get(key);

						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} is set to:\n${codeBlock(
								result
							)}`
						);

						break;
					}
					case "delete": {
						const key = interaction.options.getString("key", true);

						await userDB.delete(key);

						log.dbValueManipulated("userDB", key, "DELETED");
						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} was deleted.`
						);

						break;
					}
					case "clear": {
						await userDB.clear();

						replySuccess(interaction, this.ephemeral);

						break;
					}
				}

				break;
			}
			case "guild": {
				switch (interaction.options.getSubcommand()) {
					case "set": {
						const key = interaction.options.getString("key", true);
						const value = interaction.options.getString(
							"value",
							true
						);

						await guildDB.set(key, value);

						log.dbValueManipulated("guildDB", key, value);
						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} was set to:\n${codeBlock(
								value
							)}.`
						);

						break;
					}
					case "get": {
						const key = interaction.options.getString("key", true);

						const result = await guildDB.get(key);

						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} is set to:\n${codeBlock(
								result
							)}`
						);

						break;
					}
					case "delete": {
						const key = interaction.options.getString("key", true);

						await guildDB.delete(key);

						log.dbValueManipulated("guildDB", key, "DELETED");
						replySuccess(
							interaction,
							this.ephemeral,
							`${inlineCode(key)} was deleted.`
						);

						break;
					}
					case "clear": {
						await guildDB.clear();

						replySuccess(interaction, this.ephemeral);

						break;
					}
				}

				break;
			}
		}
	}
};
