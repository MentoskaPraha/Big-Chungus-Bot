const { verificationRoleId } = require('../configuration/otherIDs.json');
const log = require('../logger.js');

module.exports = {
    name: 'verification',
    execute(interaction){
        //find the role needed
        const role = interaction.guild.roles.cache.find(role => role.id === verificationRoleId);

        //add the role to the user
        interaction.member.roles.add(role);

        //log it to the console
        log.info(`${interaction.user.tag} has been verified.`);

        //reply to the user
        interaction.reply({content: 'Roles succesfully updated.', ephemeral: true});
    }
}
