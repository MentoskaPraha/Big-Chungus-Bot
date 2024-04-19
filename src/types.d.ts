import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface eventObject {
  name: string;
  once: boolean;
  execute(...args: unknown[]): Promise<void>;
}

export interface commandObject {
  name: string;
  global: boolean;
  dev: boolean;
  ephemeral: boolean;
  defer: boolean;
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
  autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
}
