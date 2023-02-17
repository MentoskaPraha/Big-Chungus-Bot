//dependancies
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

//userDB interfaces
export interface userDBEntry {
	id: string;
	title: string;
	color: number;
}

//guildDB interfaces
export interface guildDBEntry {
	id: string;
	colors: boolean;
	colorRoleIds: Array<string>;
	settingsManagerRoleId: string;
	moderatorRoleId: string;
	announcementRoleId: string;
	announceEvents: boolean;
	crosspostEventAnnounce: boolean;
	eventAnnounceChannelId: string;
}

//command interfaces
export interface commandObject {
	name: string;
	data: SlashCommandBuilder;
	ephemeral: boolean;
	execute(interaction: CommandInteraction): Promise<void>;
}

//event handler interfaces
export interface eventObject {
	name: string;
	once: boolean;
	execute(...args): Promise<void>;
}
