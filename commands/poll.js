//libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const emojiRegex = require('emoji-regex');
const { pollEmbedColor } = require('../config.json');


//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Creates a poll. You can not add custom emojis to your answers!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you will ask.')
                .setRequired(true)
            )
        .addStringOption(option=>
            option.setName('answer_1')
                .setDescription('The 1st answer to your question.')
                .setRequired(true)
        )
        .addStringOption(option=>
            option.setName('answer_2')
                .setDescription('The 2nd answer to your question.')
                .setRequired(true)
        )
        .addStringOption(option=>
            option.setName('answer_3')
                .setDescription('The 3rd answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_4')
                .setDescription('The 4th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_5')
                .setDescription('The 5th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_6')
                .setDescription('The 6th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_7')
                .setDescription('The 7th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_8')
                .setDescription('The 8th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_9')
                .setDescription('The 9th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_10')
                .setDescription('The 10th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_11')
                .setDescription('The 11th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_12')
                .setDescription('The 12th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_13')
                .setDescription('The 13th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_14')
                .setDescription('The 14th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_15')
                .setDescription('The 15th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_16')
                .setDescription('The 16th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_17')
                .setDescription('The 17th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_18')
                .setDescription('The 18th answer to your question.')
                .setRequired(false)
        )
        .addStringOption(option=>
            option.setName('answer_19')
                .setDescription('The 19th answer to your question.')
                .setRequired(false)
        ),
       
    //on command run execute the following
    async execute(interaction){
        //defer the reply
        await interaction.deferReply();

        //get the user input
        const question = interaction.options.getString('question');
        const answers = [];

        for(var i = 1; i < 20; i++){
           answers.push(interaction.options.getString('answer_' + i)); 
        }

        //create empty array answer emojis (done for easy future adding of custom emojis)
        const answerEmojis = [];
        for(var i = 0; answers[i] != null; i++){
            answerEmojis.push(null);
        }

        //get emojis
        const alpha = Array.from(Array(26)).map((e, i) => i + 97);
        const alphabet = alpha.map((x) => String.fromCharCode(x));
        
        for(var i = 0; i < answerEmojis.length; i++){
            if(answerEmojis[i] === null){
                answerEmojis[i] = ':regional_indicator_' + alphabet[i] + ':';
            }
        }
        
        //create the description for the poll embed
        var embedDescription = ``;

        for(var i = 0; answers[i] != null; i++){
            embedDescription += `${answerEmojis[i]} ${answers[i]}\n\n`
        }

        //create the poll embed
        const embed = new MessageEmbed()
            .setColor(pollEmbedColor)
            .setTitle(`${question}`)
            .setDescription(embedDescription);
        
        //send the message
        interaction.editReply({ content: `Poll by ${interaction.user.username}.`, embeds: [embed]})

        //add the reactions
        const message = await interaction.fetchReply();
        answerEmojis.forEach(async (ae) => {
            await message.react(ae);
        });

        //log that the command has been run to the command line
        console.log(`${interaction.user.tag} has created a new poll.`);
    }
};
