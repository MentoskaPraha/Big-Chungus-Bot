import { commandObject } from "$types";
import readDir from "@libs/utils/readDir";
import { Collection } from "discord.js";
import { join } from "node:path";

const commands = new Collection<string, commandObject>();

const commandFolder = readDir(__dirname).filter((file) => {
  const fileLocal = file.slice(file.lastIndexOf("/") + 1);
  if (
    (fileLocal.endsWith(".js") || fileLocal.endsWith(".ts")) &&
    !fileLocal.startsWith("_")
  )
    return file;
});

const subsystemFolder = readDir(
  join(__dirname.split("/commands")[0], "subsystems")
).filter((file) => {
  const fileLocal = file.slice(file.lastIndexOf("/") + 1);

  if (
    (fileLocal.endsWith(".js") || fileLocal.endsWith(".ts")) &&
    fileLocal.startsWith("command")
  )
    return file;
});

const files = Array<string>().concat(commandFolder, subsystemFolder);

files.forEach((file) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: item } = require(file);
  if (item == undefined) return;
  commands.set(item.name, item);
});

export default commands;

/**
 * Update the import of a specific command.
 * @param commandName The command to be updated.
 */
export function reloadCommand(commandName: string) {
  const command = commands.get(commandName);

  if (!command)
    throw new Error(
      `Command "${commandName}" could not be reloaded as it doesn't exist.`
    );

  let commandPath = readDir(__dirname)
    .filter((file) => {
      const fileLocal = file.slice(file.lastIndexOf("/") + 1);
      if (
        (fileLocal.endsWith(".js") || fileLocal.endsWith(".ts")) &&
        !fileLocal.startsWith("_")
      )
        return file;
    })
    .find((file) => file.includes(command.name));

  if (commandPath == undefined) {
    commandPath = readDir(join(__dirname.split("/commands")[0], "subsystems"))
      .filter((file) => {
        const fileLocal = file.slice(file.lastIndexOf("/") + 1);
        if (
          (fileLocal.endsWith(".js") || fileLocal.endsWith(".ts")) &&
          !fileLocal.startsWith("_")
        )
          return file;
      })
      .find((file) => file.includes(command.name));
  }

  if (commandPath == undefined) {
    throw new Error(`Could not resolve file for "${command.name}" command.`);
  }

  delete require.cache[require.resolve(commandPath)];

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: newCommand } = require(commandPath);

  commands.set(command.name, newCommand);
}
