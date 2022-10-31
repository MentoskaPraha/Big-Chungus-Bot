//libraries
const { SlashCommandBuilder } = require('discord.js');
const log = require('../logger.js');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('color')
		.setDescription('Use this command to set your own custom color.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('create')
                .setDescription('Create your color.')
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color you wish to have. Must be a valid HEX code with the starting #.')
                        .setRequired(true)
                    )
            )
        .addSubcommand(subcommand =>
            subcommand.setName('edit')
                .setDescription('Edit your color.')
                .addStringOption(option =>
                    option.setName('new_color')
                        .setDescription('The color you wish to have. Must be a valid HEX code with the starting #.')
                        .setRequired(true)
                    )
            )
        .addSubcommand(subcommand =>
            subcommand.setName('refresh')
                .setDescription('Re-creates your color from the database.')
            )
        .addSubcommand(subcommand =>
            subcommand.setName('delete')
                .setDescription('Deletes your color from the Discord Server, it will remain in the database.')
            ),
        
    //when command is called run the following
    async execute(interaction){
        //get the subcommand that was run
        if(interaction.options.getSubcommand() === 'create'){
            //get the user from the database
            const dbEntry = await interaction.client.functions.get('userDB').read(interaction.user.id);

            //if the user doesn't exist in the database end cmd execution
            if(dbEntry === 1){
                await interaction.editReply({content: 'Your database entry has not been found, please create one.', ephemeral: true});
                log.warn(`${interaction.user.tag} did not have a database entry and attempted to get a custom color.`);
                return;
            }

            //check if the user already doesn't have a color
            if(dbEntry.color != null){
                await interaction.editReply({content: 'You already have a custom color on record. Use the color edit command to change it or the color refresh command to get it back.', ephemeral: true});
                log.warn(`${interaction.user.tag} attempted to get a custom color, but they already had one.`);
                return;
            }

            //get the color of the role
            const color = interaction.options.getString('color');

            //check if the color is valid
            if(!/^#[0-9A-F]{6}$/i.test(color)){
                await interaction.editReply({content: 'Invalid HEX-CODE. Please try again.', ephemeral: true});
                log.warn(`${interaction.user.tag} attempted to get a custom color, but they inputed an invalid HEX-CODE.`);
                return;
            }

            //get the position of the role
            const roles = await interaction.guild.roles.fetch();
            const rolePos = roles.size - 2;

            //create the role and assign it to the user
            await interaction.guild.roles.create({
                name: `${interaction.user.username} : Color`,
                color: color,
                position: rolePos
            }).then(async role => {
                const user = await interaction.guild.members.fetch(interaction.user.id);
                await user.roles.add(role);

                //save the role id and color to the database
                await interaction.client.functions.get('userDB').edit(interaction.user.id, null, null, color, role.id);
            });

            //tell the user the action was successful
            interaction.editReply({content: 'Your color was successfully created!', ephemeral: true});
            log.info(`${interaction.user.tag} has successfully created their new color.`);

            //end code
            return;
        }

        if(interaction.options.getSubcommand() === 'edit'){
            //get the user from the database
            const dbEntry = await interaction.client.functions.get('userDB').read(interaction.user.id);

            //if the user doesn't exist in the database end code execution
            if(dbEntry === 1){
                await interaction.editReply({content: 'Your database entry has not been found, please create one.', ephemeral: true});
                log.warn(`${interaction.user.tag} did not have a database entry and attempted to edit their custom color.`);
                return;
            }

            //check if the user does have a color
            if(dbEntry.color === null){
                await interaction.editReply({content: 'You do not have a custom color on record. Use the color create command to make it.', ephemeral: true});
                log.warn(`${interaction.user.tag} attempted to edit a custom color, but they did not have one.`);
                return;
            }

            //get the color of the role
            const color = interaction.options.getString('new_color');

            //check if the color is valid
            if(!/^#[0-9A-F]{6}$/i.test(color)){
                await interaction.editReply({content: 'Invalid HEX-CODE. Please try again.', ephemeral: true});
                log.warn(`${interaction.user.tag} attempted to get a custom color, but they inputed an invalid HEX-CODE.`);
                return;
            }

            //edit the role color
            await interaction.guild.roles.edit(dbEntry.colorRoleId, {color: color});

            //save the new color to the database
            await interaction.client.functions.get('userDB').edit(interaction.user.id, null, null, color, null);

            //tell the user the action was successful
            interaction.editReply({content: 'Your color was successfully updated!', ephemeral: true});
            log.info(`${interaction.user.tag} has successfully updated their color.`);

            //end code
            return;
        }

        if(interaction.options.getSubcommand() === 'refresh'){
            //get the user from the database
            const dbEntry = await interaction.client.functions.get('userDB').read(interaction.user.id);

            //if the user doesn't exist in the database end code execution
            if(dbEntry === 1){
                await interaction.editReply({content: 'Your database entry has not been found, please create one.', ephemeral: true});
                log.warn(`${interaction.user.tag} did not have a database entry and attempted to refresh their custom color.`);
                return;
            }

            //check if the user does have a color
            if(dbEntry.color === null){
                await interaction.editReply({content: 'You do not have a custom color on record. Use the color create command to make it.', ephemeral: true});
                log.warn(`${interaction.user.tag} attempted to refresh their custom color, but they did not have one.`);
                return;
            }

            //get the position of the role
            const roles = await interaction.guild.roles.fetch();
            const rolePos = roles.size - 2;

            //re-create and re-assign the color role to the user
            await interaction.guild.roles.create({
                name: `${interaction.user.username} : Color`,
                color: dbEntry.color,
                position: rolePos
            }).then(async role => {
                const user = await interaction.guild.members.fetch(interaction.user.id);
                await user.roles.add(role);

                //save the role id and color to the database
                await interaction.client.functions.get('userDB').edit(interaction.user.id, null, null, null, role.id);
            });

            //tell the user the action was successful
            interaction.editReply({content: 'Your color was successfully refreshed!', ephemeral: true});
            log.info(`${interaction.user.tag} has successfully refreshed their color.`);

            //end code
            return;
        }

        if(interaction.options.getSubcommand() === 'delete'){
            //get the user from the database
            const dbEntry = await interaction.client.functions.get('userDB').read(interaction.user.id);

            //if the user doesn't exist in the database end code execution
            if(dbEntry === 1){
                await interaction.editReply({content: 'Your database entry has not been found, please create one.', ephemeral: true});
                log.warn(`${interaction.user.tag} did not have a database entry and attempted to delete their custom color.`);
                return;
            }

            //check if the user does have a color
            if(dbEntry.color === null){
                await interaction.editReply({content: 'You do not have a custom color on record. Use the color create command to make it.', ephemeral: true});
                log.warn(`${interaction.user.tag} attempted to delete their custom color, but they did not have one.`);
                return;
            }

            //delete the role
            await interaction.guild.roles.delete(dbEntry.colorRoleId);

            //tell the user the action was successful
            interaction.editReply({content: 'Your color was successfully deleted!', ephemeral: true});
            log.info(`${interaction.user.tag} has successfully deleted their color.`);

            //end code
            return;
        }
    }
}   
