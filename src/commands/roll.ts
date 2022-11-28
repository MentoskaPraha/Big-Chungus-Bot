//dependancies
import { SlashCommandBuilder, EmbedBuilder, CommandInteraction } from "discord.js";
import log from "../logger";
const{ diceRollerEmbedColor } = require("../config.json");

//command
export = {
    name: "roll",
    ephemeral: false,

	//command data
	data: new SlashCommandBuilder()
		.setName("roll")
		.setDescription("Rolls a dice of any size.")
        .setDMPermission(true)
        .addIntegerOption(option =>
            option.setName("dice_size")
                .setDescription("The size of the dice. Can be between 2 and 100.")
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(100)
            )
        .addIntegerOption(option =>
            option.setName("number_of_dice")
                .setDescription("Change the number of dice you want to roll, 1 by default, with a miximum of 15.")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(15)
            ),

    //command code
    async execute(interaction:CommandInteraction){
		if(!interaction.isChatInputCommand()) return;

        //get command options
        const diceSize = interaction.options.getInteger('dice_size') as number;
        let diceNumbers = interaction.options.getInteger('number_of_dice');
        if(diceNumbers == null){
            diceNumbers = 1;
        }

        //create the results message
        let resultsMessage = `You rolled ${diceNumbers} dice, each with ${diceSize} sides.\nHere are the results:`;
        for(let i = 0; i < diceNumbers; i++){
            resultsMessage += `\n${Math.floor(Math.random() * diceSize) + 1}`;
        }
        
        //create results embed
        const embed = new EmbedBuilder()
            .setColor(diceRollerEmbedColor)
            .setTitle('Dice Roller Results')
            .setDescription(resultsMessage);
        
        //respond to the user
        await interaction.editReply({embeds: [embed]});

        log.info(`${interaction.user.tag} has used the dice roller.`);
    }
};
