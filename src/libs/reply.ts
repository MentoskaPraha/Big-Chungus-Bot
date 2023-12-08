import { ChatInputCommandInteraction, ColorResolvable, inlineCode } from "discord.js";
import createEmbed from "@libs/utils/embedBuilder";
import { successEmbedColor, failureEmbedColor } from "$config";

/**
 * Replies to a command with a generic embed.
 * @param interaction The interaction to reply to.
 * @param message An extra message if you wish to provide more details about the success.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 */
export async function reply(
	interaction: ChatInputCommandInteraction,
	reply: string,
	ephemeral: boolean
) {
	const embed = createEmbed(
		interaction.commandName[0].toUpperCase() + interaction.commandName.substring(1).toLowerCase(),
		reply,
		undefined,
		{
			name: interaction.client.user.username,
			iconURL: interaction.client.user.displayAvatarURL() as string
		},
		new Date(Date.now()),
		undefined,
		{
			text: `This is a reply to the command "${interaction.commandName}" ran by ${interaction.user.tag}.`
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
 * Reply with a small success embed.
 * @param interaction The interaction to reply to.
 * @param message An extra message if you wish to provide more details about the success.
 * @param ephemeral Whether the reply should only be visible to the user. Default is false. **Will be ignore if the message is already replied to.**
 */
export async function replySuccess(
	interaction: ChatInputCommandInteraction,
	message?: string,
	ephemeral?: boolean
) {
	const embed = createEmbed(
		"Success!",
		message ? message : "The action was successful!",
		successEmbedColor as ColorResolvable
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
		failureEmbedColor as ColorResolvable
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
