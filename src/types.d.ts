import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface eventObject {
	name: string;
	once: boolean;
	execute(...args: unknown[]): Promise<void>;
}

export interface commandObject {
	name: string;
	global: boolean;
	ephemeral: boolean;
	data: SlashCommandBuilder;
	execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
