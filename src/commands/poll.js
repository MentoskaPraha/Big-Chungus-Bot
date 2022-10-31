//libraries
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pollEmbedColor } = require('../configuration/embedColors.json');
const log = require('../logger.js');

//command information
module.exports = {
	//build the command
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Creates a poll. You can not add custom emojis to your answers!')
        .setDMPermission(true)
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
        )
        .addStringOption(option=>
            option.setName('answer_20')
                .setDescription('The 20th answer to your question.')
                .setRequired(false)
            ),
       
    //on command run execute the following
    async execute(interaction){
        //get the user input
        const question = interaction.options.getString('question');
        const answers = [];

        for(let i = 1; interaction.options.getString('answer_' + i) !== null; i++){
           answers.push(interaction.options.getString('answer_' + i)); 
        }
        answers.push(null);

        //get emojis
        const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
            '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];

        //get the embed description
        var embedDescription = `${emojis[0]} ${answers[0]}`;
        for(let i = 1; answers[i] != null; i++){
            embedDescription += `\n\n${emojis[i]} ${answers[i]}`;
        }

        let embed = new EmbedBuilder()
            .setColor(pollEmbedColor)
            .setTitle(question)
            .setDescription(embedDescription);

        //send poll
        await interaction.editReply({content: `Poll by ${await interaction.client.functions.get('userDB').getTitle(interaction.user.id)} ${interaction.user.username}.`, embeds: [embed]});

        //add reactions
        const message = await interaction.fetchReply();
        for(let i = 0; answers[i] != null; i++){
            await message.react(emojis[i]);
        }

        //log that the command has been run to the command line
        log.info(`${interaction.user.tag} has created a new poll.`);
    }
};
