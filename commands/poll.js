//libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { pollEmbedColor } = require('../config.json');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Creates a poll.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you will ask.')
                .setRequired(true)
            )
        .addStringOption(option=>
            option.setName('answer_1')
                .setDescription('The first answer to your question.')
                .setRequired(true)
        )
        .addStringOption(option=>
            option.setName('answer_2')
                .setDescription('The second answer to your question.')
                .setRequired(true)
        )
        .addStringOption(option=>
            option.setName('answer_3')
                .setDescription('The third answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_4')
                .setDescription('The fourth answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_5')
                .setDescription('The fifth answer to your question.')
                .setRequired(false)
        ),
       
    //on command run execute the following
    async execute(interaction){
        //defer the reply
        await interaction.deferReply();

        //get the user input
        const question = interaction.options.getString('question');
        const answer_1 = interaction.options.getString('answer_1');
        const answer_2 = interaction.options.getString('answer_2');
        const answer_3 = interaction.options.getString('answer_3');
        const answer_4 = interaction.options.getString('answer_4');
        const answer_5 = interaction.options.getString('answer_5');
        
        //create the description for the poll embed
        var embedDescription = `:one: ${answer_1}\n\n:two: ${answer_2}`;

        if(answer_3 !== null) embedDescription += `\n\n:three: ${answer_3}`;

        if(answer_4 !== null) embedDescription += `\n\n:four: ${answer_4}`;

        if(answer_5 !== null) embedDescription += `\n\n:five: ${answer_5}`;

        //create the poll embed
        const embed = new MessageEmbed()
            .setColor(pollEmbedColor)
            .setTitle(`${question}`)
            .setDescription(embedDescription)
        
        //send the message
        interaction.editReply({ content: `Poll by ${interaction.user.tag}.`, embeds: [embed]})

        //add the reactions
        const message = await interaction.fetchReply();

        if(answer_5 !== null){
            message.react('1️⃣')
			    .then(() => message.react('2️⃣'))
			    .then(() => message.react('3️⃣'))
                .then(() => message.react('4️⃣'))
                .then(() => message.react('5️⃣'))
			    .catch(error => console.error('One of the emojis failed to react:', error));
        } else{
            if(answer_4 !== null){
                message.react('1️⃣')
                    .then(() => message.react('2️⃣'))
                    .then(() => message.react('3️⃣'))
                    .then(() => message.react('4️⃣'))
                    .catch(error => console.error('One of the emojis failed to react:', error));
            } else{
                if(answer_3 !== null){
                    message.react('1️⃣')
                        .then(() => message.react('2️⃣'))
                        .then(() => message.react('3️⃣'))
                        .catch(error => console.error('One of the emojis failed to react:', error));
                } else{
                        message.react('1️⃣')
                            .then(() => message.react('2️⃣'))
                            .catch(error => console.error('One of the emojis failed to react:', error));
                }
            }
        }

        //log that the command has been run to the command line
        console.log(`${interaction.user.tag} has created a new poll.`);
    }
};
