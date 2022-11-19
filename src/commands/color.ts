//libraries
import { Collection, ColorResolvable, CommandInteraction, Role, SlashCommandBuilder } from "discord.js";
import functions from "../functions/_functionList";
import log from "../logger";

//command information
export = {
    name: "color",

	//build the command
	data: new SlashCommandBuilder()
		.setName("color")
		.setDescription("Use this command to set your own custom color.")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("update")
                .setDescription("Updates or creates your color.")
                .addStringOption(option =>
                    option.setName("color")
                        .setDescription("The color you wish to have. Must be a valid HEX-CODE with the starting '#'.")
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
    
    //when command is called run the following
    async execute(interaction:CommandInteraction){
        //check if the command is a slash command
		if(!interaction.isChatInputCommand()) return;

        //get the database entry on the user
        const userDB = functions.get("userDB") as userDBFuncs;
        const potentialDBEntry = await userDB.read(interaction.user.id);

        //if the user doesn't exist in the database end cmd execution
        if(potentialDBEntry == 1){
            await interaction.editReply("Your database entry has not been found, please create one.");
            log.warn(`${interaction.user.tag} did not have a database entry and attempted to get a custom color.`);
            return;
        }
        const dbEntry = potentialDBEntry as userDBEntry;

        //get the subcommand that was run
        switch(interaction.options.getSubcommand()){
            case "update":{
                //get the color of the role
                const color = interaction.options.getString("color") as string;

                //check if the color is valid
                if(!/^#[0-9A-F]{6}$/i.test(color)){
                    await interaction.editReply("Invalid HEX-CODE. Please try again. Make sure the HEX-CODE starts with a '#'.");
                    log.warn(`${interaction.user.tag} attempted to get a custom color, but they inputed an invalid HEX-CODE.`);
                    break;
                }

                //get the roles
                const roles = await interaction.guild?.roles.fetch() as Collection<string, Role>;
                const role = roles.find(role => role.name == `${interaction.user.username} : Color`);

                //if the user already has a color role then update that role
                if(role){
                    role.edit({color: color as ColorResolvable});

                    //respond to user
                    interaction.editReply("Your color was successfully updated.");
                    log.info(`${interaction.user.tag} has successfully update their new color.`);

                    //end code
                    break;
                }

                //get the position of the role
                const rolePos = roles.find(role => role.name == interaction.client.user.username)?.position as number;

                //create the role and assign it to the user
                await interaction.guild?.roles.create({
                    name: `${interaction.user.username} : Color`,
                    color: color as ColorResolvable,
                    position: rolePos
                }).then(async role => {
                    const user = await interaction.guild?.members.fetch(interaction.user.id);
                    await user?.roles.add(role);

                    //save the role id and color to the database
                    await userDB.edit(interaction.user.id, null, color, role.id);
                });

                //tell the user the action was successful
                await interaction.editReply("Your color was successfully created!");
                log.info(`${interaction.user.tag} has successfully created their new color.`);

                //end code
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
                    await interaction.editReply("You do not have a custom color on record. Use the color update command to make it.");
                    log.warn(`${interaction.user.tag} attempted to refresh their custom color, but they did not have one.`);
                    break;
                }

                //get the position of the role
                const roles = await interaction.guild?.roles.fetch() as Collection<string, Role>;
                const rolePos = roles.find(role => role.name == interaction.client.user.username)?.position as number;

                //re-create and re-assign the color role to the user
                await interaction.guild?.roles.create({
                    name: `${interaction.user.username} : Color`,
                    color: dbEntry.color as ColorResolvable,
                    position: rolePos
                }).then(async role => {
                    const user = await interaction.guild?.members.fetch(interaction.user.id);
                    await user?.roles.add(role);

                    //save the role id and color to the database
                    await userDB.edit(interaction.user.id, null, null, role.id);
                });

                //tell the user the action was successful
                await interaction.editReply("Your color was successfully refreshed!");
                log.info(`${interaction.user.tag} has successfully refreshed their color.`);

                //end code
                break;
            }

            case "delete":{
                //check if the user does have a color
                if(dbEntry.colorRoleId == "N/A"){
                    await interaction.editReply("You do not have a custom color on record. Use the color create command to make it.");
                    log.warn(`${interaction.user.tag} attempted to delete their custom color, but they did not have one.`);
                    return;
                }

                //delete the role
                await interaction.guild?.roles.delete(dbEntry.colorRoleId);

                //update the database
                await userDB.edit(interaction.user.id, null, null, "N/A");

                //tell the user the action was successful
                await interaction.editReply("Your color was successfully deleted!");
                log.info(`${interaction.user.tag} has successfully deleted their color.`);

                //end code
                break;
            }
        }
    }
}   
