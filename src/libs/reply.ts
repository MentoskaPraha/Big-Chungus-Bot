import { ChatInputCommandInteraction } from "discord.js";
import { createEmbed } from "@libs/embedBuilder";

export async function reply(
	interaction: ChatInputCommandInteraction,
	reply: string,
	ephemeral: boolean
) {}

/**
 * Reply with a small success embed.
 * @param interaction The interaction to reply to.
 * @param message An extra message if you wish to provide more details about the success.
 * @param ephemeral Whether the reply should only be visible to the user.
 */
export async function replySuccess(
	interaction: ChatInputCommandInteraction,
	message?: string,
	ephemeral?: boolean
) {
	const embed = createEmbed(
		"Success!",
		message ? message : "The action was successful!",
		"Green"
	);
	if (interaction.deferred) {
		await interaction.editReply({ embeds: [embed] });
		return;
	}

	if (interaction.replied) {
		await interaction.followUp({ embeds: [embed] });
		return;
	}

	await interaction.reply({ ephemeral: ephemeral, embeds: [embed] });
}

/**
 * Reply with a small failure embed, if something goes wrong.
 * @param interaction The interaction to reply to.
 * @param message An extra message if you wish to provide more details about the failure.
 * @param ephemeral Whether the reply should only be visible to the user. **Is ignored if the message has already been replied to.**
 */
export async function replyFailure(
	interaction: ChatInputCommandInteraction,
	message?: string,
	ephemeral?: boolean
) {
	const embed = createEmbed(
		"Failure!",
		message ? message : "The action has failed!",
		"Red"
	);
	if (interaction.deferred) {
		await interaction.editReply({ embeds: [embed] });
		return;
	}

	if (interaction.replied) {
		await interaction.followUp({ embeds: [embed] });
		return;
	}

	await interaction.reply({ ephemeral: ephemeral, embeds: [embed] });
}
