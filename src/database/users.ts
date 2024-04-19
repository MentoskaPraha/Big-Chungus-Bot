import { userDB } from "@database";
import { Snowflake } from "discord.js";

export interface userEntry {
  birthday: Date | undefined;
}

/**
 * Creates a new user in userDB.
 * @param id The id of the user.
 * @returns the new user that got created in the database.
 */
export async function createUser(id: Snowflake) {
  const newUser: userEntry = {
    birthday: undefined
  };
  await userDB.set(id, newUser);
  return newUser;
}

/**
 * Gets a user from userDB.
 * @param id The id of the user.
 * @returns The specified user.
 */
export async function getUser(id: Snowflake) {
  const user = (await userDB.get(id)) as userEntry | undefined;
  if (user == undefined) return await createUser(id);
  return user;
}

/**
 * Gets the Date object of the users birthday if they set one.
 * @param id The id of the user.
 * @returns The Date or undefined if the user doesn't have one.
 */
export async function getUserBirthday(id: Snowflake) {
  const user = (await userDB.get(id)) as userEntry | undefined;
  if (user == undefined) return undefined;
  return user.birthday;
}

/**
 * Sets the Date object of the users birthday.
 * @param id The id of the user.
 * @param newBirthday The new date the birthday should be set to. Ommit if you wish to unset this property.
 */
export async function setUserBirthday(id: Snowflake, newBirthday?: Date) {
  let user = (await getUser(id)) as userEntry;
  user.birthday = newBirthday;
  await userDB.set(id, user);
}
