import {
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedBuilder
} from "discord.js";
import createEmbed from "@libs/utils/embedBuilder";
import { successEmbedColor, failureEmbedColor } from "$config";

/**
 * Replies to a command with a generic embed.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param reply The response to the command.
 */
export async function reply(
	interaction: ChatInputCommandInteraction,
	ephemeral: boolean,
	reply: string
) {
	const embed = createEmbed(
		interaction.commandName[0].toUpperCase() +
			interaction.commandName.substring(1).toLowerCase(),
		reply,
		undefined,
		undefined,
		new Date(Date.now()),
		undefined,
		{
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		}
	);

	if (interaction.replied) {
		await interaction.followUp({ embeds: [embed] });
		return;
	}

	if (interaction.deferred) {
		await interaction.editReply({ embeds: [embed] });
		return;
	}

	await interaction.reply({
		ephemeral: ephemeral != undefined ? ephemeral : false,
		embeds: [embed]
	});
}

/**
 * Replies to a command with a custom embed and a simple string response, the embeds footer and timestamp will be overriden to match the default format.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param string The string that will be used in the reply.
 * @param embeds The embed or embeds that will be attached to the reply.
 */
export async function replyStringEmbed(
	interaction: ChatInputCommandInteraction,
	ephemeral: boolean,
	string: string,
	...embeds: EmbedBuilder[]
) {
	embeds.forEach((embed) => {
		embed.setTimestamp(new Date(Date.now())).setFooter({
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		});
	});

	if (interaction.replied) {
		await interaction.followUp({ content: string, embeds: embeds });
		return;
	}

	if (interaction.deferred) {
		await interaction.editReply({ content: string, embeds: embeds });
		return;
	}

	await interaction.reply({
		ephemeral: ephemeral != undefined ? ephemeral : false,
		content: string,
		embeds: embeds
	});
}

/**
 * Replies to a command with a custom embed, the embeds footer and timestamp will be overriden to match the default format.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param embeds The embed or embeds that will be attached to the reply.
 */
export async function replyEmbed(
	interaction: ChatInputCommandInteraction,
	ephemeral: boolean,
	...embeds: EmbedBuilder[]
) {
	embeds.forEach((embed) => {
		embed.setTimestamp(new Date(Date.now())).setFooter({
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		});
	});

	if (interaction.replied) {
		await interaction.followUp({ embeds: embeds });
		return;
	}

	if (interaction.deferred) {
		await interaction.editReply({ embeds: embeds });
		return;
	}

	await interaction.reply({
		ephemeral: ephemeral != undefined ? ephemeral : false,
		embeds: embeds
	});
}

/**
 * Replies to a command with a simple string response.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param string The string that will be sent as a response to the command.
 */
export async function replyString(
	interaction: ChatInputCommandInteraction,
	ephemeral: boolean,
	string: string
) {
	if (interaction.replied) {
		await interaction.followUp(string);
		return;
	}

	if (interaction.deferred) {
		await interaction.editReply(string);
		return;
	}

	await interaction.reply({
		ephemeral: ephemeral != undefined ? ephemeral : false,
		content: string
	});
}

/**
 * Reply with a small success embed.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param message An extra message if you wish to provide more details about the success.
 */
export async function replySuccess(
	interaction: ChatInputCommandInteraction,
	ephemeral?: boolean,
	message?: string
) {
	const embed = createEmbed(
		"Success!",
		message ? message : "The action was successful!",
		successEmbedColor as ColorResolvable,
		undefined,
		new Date(Date.now()),
		undefined,
		{
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		}
	);

	if (interaction.replied) {
		await interaction.followUp({ embeds: [embed] });
		return;
	}

	if (interaction.deferred) {
		await interaction.editReply({ embeds: [embed] });
		return;
	}

	await interaction.reply({
		ephemeral: ephemeral != undefined ? ephemeral : false,
		embeds: [embed]
	});
}

/**
 * Reply with a small failure embed, if something goes wrong.
 * @param interaction The interaction to reply to.
 * @param message An extra message if you wish to provide more details about the failure.
 */
export async function replyFailure(
	interaction: ChatInputCommandInteraction,
	message?: string
) {
	const embed = createEmbed(
		"Failure!",
		message ? message : "The action has failed!",
		failureEmbedColor as ColorResolvable,
		undefined,
		new Date(Date.now()),
		undefined,
		{
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		}
	);

	if (interaction.replied) {
		await interaction.followUp({ embeds: [embed] });
		return;
	}

	if (interaction.deferred) {
		await interaction.editReply({ embeds: [embed] });
		return;
	}

	await interaction.reply({ ephemeral: true, embeds: [embed] });
}
