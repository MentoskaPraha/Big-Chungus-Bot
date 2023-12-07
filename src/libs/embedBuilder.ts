import {
	ColorResolvable,
	EmbedAuthorData,
	EmbedBuilder,
	EmbedField,
	EmbedFooterOptions
} from "discord.js";

export function createEmbed(
	title: string,
	description: string,
	color: ColorResolvable,
	author?: EmbedAuthorData,
	timestamp?: number,
	thumbnail?: string,
	footer?: EmbedFooterOptions,
	...fields: EmbedField[]
) {
	const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(color);

	if (author) embed.setAuthor(author);
	if (timestamp) embed.setTimestamp(timestamp);
	if (thumbnail) embed.setThumbnail(thumbnail);
	if (footer) embed.setFooter(footer);
	if (fields) embed.addFields(fields);

	return embed;
}
