//libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const { announcerRoleId } = require('../configuration/otherIDs.json');
const log = require('../logger.js');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Creates an announcement.')
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel the announcement will be sent to.')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('announcement')
                .setDescription('The announcement itself.')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the announcement.')
                .setRequired(false)
            )    
        .addMentionableOption(option =>
            option.setName('ping')
                .setDescription('The role/person that will be pinged, leave blank to not ping anyone.')
                .setRequired(false)
            ),
        
    //when command is called run the following
    async execute(interaction){
        //check if user has permissions to make the announcement
        if (interaction.member.roles.cache.some(role => role.id === announcerRoleId)) {
            //defer the reply
            await interaction.deferReply({ephemeral: true});

            //get all of the options
            const title = interaction.options.getString('title');
            const announcement = interaction.options.getString('announcement');
            const ping = interaction.options.getMentionable('ping');
            const channel = interaction.options.getChannel('channel');
            
            //make the announcement
            try {
		        await interaction.client.functions.get('sendAnnouncement').execute(title, announcement, ping, channel, interaction.user, true);
	        } catch (error) {
		        log.error(error);
		        await interaction.editReply({ content: 'There was an error while executing this command.', ephemeral: true });
	        }
            
            //give confirmation to the user that the command was successful
            await interaction.editReply({content: 'Your announcement has been sent and published.', ephemeral: true});
            log.info(`${interaction.user.tag} made an anouncement.`);
        } else{
            //give error if user does not have permissions
            await interaction.reply({content: 'You do not have permissions to run this command.', ephemeral: true});
            log.warn(`${interaction.user.tag} attempted to run "/announce".`);
            return;
        }
    }
};
