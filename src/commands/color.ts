//libraries
import { Collection, ColorResolvable, CommandInteraction, PermissionResolvable, Role, SlashCommandBuilder } from "discord.js";
import { userDBEntry, userDBFuncs } from "../types";
import functions from "../functions/_functionList";
import log from "../logger";

//command
export = {
    name: "color",
    ephemeral: true,

	//command information
	data: new SlashCommandBuilder()
		.setName("color")
		.setDescription("Use this command to set your own custom color.")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("update")
                .setDescription("Updates or creates your color.")
                .addStringOption(option =>
                    option.setName("color")
                        .setDescription("The color you wish to have. Must be a valid HEX-CODE with a leading `#`.")
                        .setRequired(true)
                    )
            )
        .addSubcommand(subcommand =>
            subcommand.setName("view")
                .setDescription("Get the hex code of your color.")
            )
        .addSubcommand(subcommand =>
            subcommand.setName("refresh")
                .setDescription("Re-creates your color from the database.")
            )
        .addSubcommand(subcommand =>
            subcommand.setName("delete")
                .setDescription("Deletes your color from the Discord Server, it will remain in the database.")
            ),
    
    //command code
    async execute(interaction:CommandInteraction){
		if(!interaction.isChatInputCommand()) return;

        //userDB entry on user
        const userDB = functions.get("userDB") as userDBFuncs;
        const potentialDBEntry = await userDB.read(interaction.user.id);
        if(potentialDBEntry == false){
            await interaction.editReply("Your database entry has not been found, please create one using `/database create`.");
            log.warn(`${interaction.user.tag} failed to update his color, due to not having a userDB entry.`);
            return;
        }
        const dbEntry = potentialDBEntry as userDBEntry;

        switch(interaction.options.getSubcommand()){
            case "update":{
                //get command options
                const color = interaction.options.getString("color") as string;

                //validate HEX-Code input
                if(!/^#[0-9A-F]{6}$/i.test(color)){
                    await interaction.editReply("Invalid HEX-CODE. Please try again. Make sure the HEX-CODE has a leading `#`.");
                    log.warn(`${interaction.user.tag} failed to update his color, due to inputting an invalid HEX-CODE.`);
                    break;
                }

                //get the color role
                const roles = await interaction.guild?.roles.fetch() as Collection<string, Role>;
                const role = roles.find(role => role.id == dbEntry.colorRoleId);

                //if the user has a color role then update it
                if(role){
                    await role.edit({color: color as ColorResolvable});

                    await userDB.edit(interaction.user.id, null, color, null);

                    await interaction.editReply("Your color was successfully updated.");
                    log.info(`${interaction.user.tag} has update their new color.`);

                    break;
                }

                //get the position of the role
                const rolePos = roles.find(role => role.name == interaction.client.user.username)?.position as number;

                //create the role and assign it to the user
                await interaction.guild?.roles.create({
                    name: `${interaction.user.username} : Color`,
                    color: color as ColorResolvable,
                    position: rolePos,
                    permissions: "0" as PermissionResolvable
                }).then(async role => {
                    const user = await interaction.guild?.members.fetch(interaction.user.id);
                    await user?.roles.add(role);

                    //save the role id and color to the database
                    await userDB.edit(interaction.user.id, null, color, role.id);
                });

                //tell the user the action was successful
                await interaction.editReply("Your color was successfully created!");
                log.info(`${interaction.user.tag} has created their new color.`);

                break;
            }

            case "view":{
                await interaction.editReply(`The HEX-CODE of your color is ${dbEntry.color}.`);
                log.info(`${interaction.user.tag} has viewed their color.`);
                break;
            }

            case "refresh":{
                //check if the user does have a color
                if(dbEntry.color == "N/A"){
                    await interaction.editReply("You do not have a custom color on record. Use the `/color update` command to make it.");
                    log.warn(`${interaction.user.tag} failed to refresh their color, du to not having one.`);
                    break;
                }

                //check if the color role alread exists
                const roles = await interaction.guild?.roles.fetch() as Collection<string, Role>;
                const role = roles.find(role => role.id == dbEntry.colorRoleId);

                if(role){
                    //re-add the role
                    const user = await interaction.guild?.members.fetch(interaction.user.id);
                    await user?.roles.add(role);

                    //tell the user the action was successful
                    await interaction.editReply("Your color was successfully refreshed!");
                    log.info(`${interaction.user.tag} has refreshed their color.`);

                    break;
                }

                //get the position of the role
                const rolePos = roles.find(role => role.name == interaction.client.user.username)?.position as number;

                //re-create and re-assign the color role to the user
                await interaction.guild?.roles.create({
                    name: `${interaction.user.username} : Color`,
                    color: dbEntry.color as ColorResolvable,
                    position: rolePos,
                    permissions: "0" as PermissionResolvable
                }).then(async role => {
                    const user = await interaction.guild?.members.fetch(interaction.user.id);
                    await user?.roles.add(role);

                    //save the role id and color to the database
                    await userDB.edit(interaction.user.id, null, null, role.id);
                });

                //tell the user the action was successful
                await interaction.editReply("Your color was successfully refreshed!");
                log.info(`${interaction.user.tag} has refreshed their color.`);

                break;
            }

            case "delete":{
                //check if the user does have a color
                if(dbEntry.colorRoleId == "N/A"){
                    await interaction.editReply("You do not have a custom color on record. Use the color create command to make it.");
                    log.warn(`${interaction.user.tag} failed to delete their color, due to not having one.`);
                    return;
                }

                //delete the role
                await interaction.guild?.roles.delete(dbEntry.colorRoleId);

                //update the database
                await userDB.edit(interaction.user.id, null, null, "N/A");

                //tell the user the action was successful
                await interaction.editReply("Your color was successfully deleted!");
                log.info(`${interaction.user.tag} has deleted their color.`);

                break;
            }
        }
    }
}   
