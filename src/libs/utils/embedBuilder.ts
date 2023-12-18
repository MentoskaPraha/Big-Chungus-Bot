import {
	ColorResolvable,
	EmbedAuthorData,
	EmbedBuilder,
	EmbedField,
	EmbedFooterOptions
} from "discord.js";
import { defaultEmbedColor } from "$config";

/**
 * Creates an embed based on the parameters passed to it, removing
 * the need for complex `EmbedBuilder` creating in code.
 * @param title The title of the embed.
 * @param description The main description of the embed.
 * @param color The color of the little side bar on the embed.
 * @param author An object with the information about the author, including name, URL and iconURL.
 * @param timestamp The date to be displayed on the embed.
 * @param thumbnail The URL of the image that will be displayed on the embed.
 * @param fields The fields you wish to add to the embed, each field should have a name and a value.
 *
 */
export default function createEmbed(
	title: string | null,
	description: string | null,
	color?: ColorResolvable,
	author?: EmbedAuthorData,
	timestamp?: Date,
	thumbnail?: string,
	footer?: EmbedFooterOptions,
	...fields: EmbedField[]
) {
	const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(color ? color : (defaultEmbedColor as ColorResolvable))
		.setTimestamp(timestamp ? timestamp : new Date(Date.now()));

	if (author) embed.setAuthor(author);
	if (thumbnail) embed.setThumbnail(thumbnail);
	if (footer) embed.setFooter(footer);
	if (fields) embed.addFields(fields);

	return embed;
}
