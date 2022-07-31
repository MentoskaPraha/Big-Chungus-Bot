module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		//code to run when an interaction is recieved
        //if the interaction is a command run the following code and return
	    if (interaction.isCommand()){
	        //get the command name
	        const command = interaction.client.commands.get(interaction.commandName);

	        //if the command does not exist return
	        if (!command) return;

            //check the commands folder for the command and run it's code
	        try {
		        await command.execute(interaction);
	        } catch (error) {
		        console.error(error);
		        await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
	        }

            //prevent other code from being run
            return;
        }

        //if interaction is a button run the following and return
	    if (interaction.isButton()){
            //execute code depending on the button that was pressed
	        if (interaction.customId === 'verification'){
                //get button code
		        const otherInteractions = interaction.client.otherInteractions.get('verification');

                //run the code needed for the interaction
                try {
                    await otherInteractions.execute(interaction);
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'There was an error while pressing this button.', ephemeral: true });
                }

                //prevent other code from being run
                return;
	        }

            //prevent other code from being run
            return;
        }


	}
};