import {
	APIEmbed,
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedBuilder
} from "discord.js";
import {
	defaultEmbedColor,
	successEmbedColor,
	failureEmbedColor
} from "$config";

/**
 * Replies to a command with a generic embed.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param reply The response to the command.
 * @returns The message that was sent as a reply.
 */
export async function reply(
	interaction: ChatInputCommandInteraction,
	ephemeral: boolean,
	reply: string
) {
	const embed = new EmbedBuilder()
		.setTitle(
			interaction.commandName[0].toUpperCase() +
				interaction.commandName.substring(1).toLowerCase()
		)
		.setDescription(reply)
		.setColor(defaultEmbedColor as ColorResolvable)
		.setTimestamp(Date.now())
		.setFooter({
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		});

	if (interaction.replied) {
		return await interaction.followUp({
			embeds: [embed],
			ephemeral:
				ephemeral != undefined && interaction.guild != null
					? ephemeral
					: false
		});
	}

	if (interaction.deferred) {
		return await interaction.editReply({ embeds: [embed] });
	}

	return await interaction.reply({
		ephemeral:
			ephemeral != undefined && interaction.guild != null
				? ephemeral
				: false,
		embeds: [embed],
		fetchReply: true
	});
}

/**
 * Replies to a command with a custom embed and a simple string response, the embeds footer and timestamp will be overriden to match the default format.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param string The string that will be used in the reply.
 * @param embeds The embed or embeds that will be attached to the reply.
 * @returns The message that was sent as a reply.
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
		return await interaction.followUp({
			content: string,
			embeds: embeds,
			ephemeral:
				ephemeral != undefined && interaction.guild != null
					? ephemeral
					: false
		});
	}

	if (interaction.deferred) {
		return await interaction.editReply({ content: string, embeds: embeds });
	}

	return await interaction.reply({
		ephemeral:
			ephemeral != undefined && interaction.guild != null
				? ephemeral
				: false,
		content: string,
		embeds: embeds,
		fetchReply: true
	});
}

/**
 * Replies to a command with a custom embed, the embeds footer and timestamp will be overriden to match the default format.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param embeds The embed or embeds that will be attached to the reply.
 * @returns The message that was sent as a reply.
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
		return await interaction.followUp({
			embeds: embeds,
			ephemeral:
				ephemeral != undefined && interaction.guild != null
					? ephemeral
					: false
		});
	}

	if (interaction.deferred) {
		return await interaction.editReply({ embeds: embeds });
	}

	return await interaction.reply({
		ephemeral:
			ephemeral != undefined && interaction.guild != null
				? ephemeral
				: false,
		embeds: embeds,
		fetchReply: true
	});
}

/**
 * Replies to a command with a simple string response.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param string The string that will be sent as a response to the command.
 * @returns The message that was sent as a reply.
 */
export async function replyString(
	interaction: ChatInputCommandInteraction,
	ephemeral: boolean,
	string: string
) {
	if (interaction.replied) {
		return await interaction.followUp({
			content: string,
			ephemeral:
				ephemeral != undefined && interaction.guild != null
					? ephemeral
					: false
		});
	}

	if (interaction.deferred) {
		return await interaction.editReply(string);
	}

	return await interaction.reply({
		ephemeral:
			ephemeral != undefined && interaction.guild != null
				? ephemeral
				: false,
		content: string,
		fetchReply: true
	});
}

/**
 * Reply with a small success embed.
 * @param interaction The interaction to reply to.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 * @param message An extra message if you wish to provide more details about the success.
 * @returns The message that was sent as a reply.
 */
export async function replySuccess(
	interaction: ChatInputCommandInteraction,
	ephemeral?: boolean,
	message?: string
) {
	const embed = new EmbedBuilder()
		.setTitle("Success!")
		.setDescription(message ? message : "The action was successful.")
		.setColor(successEmbedColor as ColorResolvable)
		.setTimestamp(Date.now())
		.setFooter({
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		});

	if (interaction.replied) {
		return await interaction.followUp({
			embeds: [embed],
			ephemeral:
				ephemeral != undefined && interaction.guild != null
					? ephemeral
					: false
		});
	}

	if (interaction.deferred) {
		return await interaction.editReply({ embeds: [embed] });
	}

	return await interaction.reply({
		ephemeral:
			ephemeral != undefined && interaction.guild != null
				? ephemeral
				: false,
		embeds: [embed],
		fetchReply: true
	});
}

/**
 * Reply with a small failure embed, if something goes wrong.
 * @param interaction The interaction to reply to.
 * @param message An extra message if you wish to provide more details about the failure.
 * @returns The message that was sent as a reply.
 */
export async function replyFailure(
	interaction: ChatInputCommandInteraction,
	message?: string
) {
	const embed = new EmbedBuilder()
		.setTitle("Failure!")
		.setDescription(message ? message : "The action has failed.")
		.setColor(failureEmbedColor as ColorResolvable)
		.setTimestamp(Date.now())
		.setFooter({
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		});

	if (interaction.replied) {
		return await interaction.followUp({
			embeds: [embed],
			ephemeral: interaction.guild != null ? true : false
		});
	}

	if (interaction.deferred) {
		return await interaction.editReply({ embeds: [embed] });
	}

	return await interaction.reply({
		ephemeral: interaction.guild != null ? true : false,
		embeds: [embed],
		fetchReply: true
	});
}

/**
 * Add new data to the reply without altering the old data, the embeds footer and timestamp will be overriden to match the default format
 * @param interaction The interaction to reply to.
 * @param message The message to be appended to the reply.
 * @param embeds The embeds to be appended to the reply.
 * @returns The message with the appended data.
 */
export async function appendReply(
	interaction: ChatInputCommandInteraction,
	message?: string,
	...embeds: EmbedBuilder[]
) {
	if (!interaction.replied) {
		throw new Error(
			"Cannot edit reply to an interaction that wasn't replied yet!"
		);
	}

	const reply = await interaction.fetchReply();
	const replyEmbeds: APIEmbed[] = [];

	reply.embeds.forEach((embed) => {
		replyEmbeds.push(embed.toJSON());
	});

	embeds.forEach((embed) => {
		embed.setTimestamp(new Date(Date.now())).setFooter({
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		});
		replyEmbeds.push(embed.toJSON());
	});

	return await interaction.editReply({
		content: reply.content + message ? message : "",
		embeds: replyEmbeds
	});
}

/**
 * Replace the data in the reply with new data, the embeds footer and timestamp will be overriden to match the default format
 * @param interaction The interaction to reply to.
 * @param message The message to replace the original.
 * @param embeds The embeds to replace the original.
 * @returns The message with the new data.
 */
export async function alterReply(
	interaction: ChatInputCommandInteraction,
	message?: string,
	...embeds: EmbedBuilder[]
) {
	if (!interaction.replied) {
		throw new Error(
			"Cannot edit reply to an interaction that wasn't replied yet!"
		);
	}

	embeds.forEach((embed) => {
		embed.setTimestamp(new Date(Date.now())).setFooter({
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`,
			iconURL: interaction.client.user.displayAvatarURL()
		});
	});

	return await interaction.editReply({
		content: message ? message : "",
		embeds: embeds
	});
}
