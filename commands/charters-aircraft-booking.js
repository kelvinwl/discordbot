const {SlashCommandBuilder} = require('@discordjs/builders');
const {Client, Collection, Intents, Interaction} = require('discord.js');
const fetch = require('node-fetch');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('charters-aircraft-booking')
        .setDescription('Use this command to book an aircraft in OnAir.'
        ).addStringOption(option =>
            option.setName('airline-code').setDescription('What is your airline code?').setRequired(true)
        ).addStringOption(option =>
            option.setName('aircraft-type').setDescription('What is the aircraft type of the aircraft you will use?').setRequired(true)
        ).addStringOption(option =>
            option.setName('tail-number').setDescription('Enter the Tail Number. Please use all caps.').setRequired(true)
        ).addStringOption(option =>
            option.setName('starting-icao').setDescription('Where will you start this flight?').setRequired(true)
        ).addStringOption(option =>
            option.setName('ending-icao').setDescription('Where will you end this flight?').setRequired(true)
        ).addIntegerOption(option =>
            option.setName('booking-begins').setDescription('When would you like to start? Aircraft can be reserved up to 3 hours before ETD. All times in Zulu.').setRequired(true)
        ).addIntegerOption(option =>
            option.setName('booking-ends').setDescription('When will you be finished?').setRequired(true)
        ).addStringOption(option =>
            option.setName('comments').setDescription('Any comments you would like to add about this booking?').setRequired(false)
        ),
    async execute(interaction, client) {
        const a3201channel = interaction.guild.client.channels.cache.get(process.env.A320_AIRCRAFT_1CHANNEL)//CORRECT CHANNEL: A320_AIRCRAFT_1CHANNEL
        const a3202channel = interaction.guild.client.channels.cache.get(process.env.A320_AIRCRAFT_2CHANNEL)//CORRECT CHANNEL: A320_AIRCRAFT_2CHANNEL
        const b7371channel = interaction.guild.client.channels.cache.get(process.env.B737_AIRCRAFT_1CHANNEL)//CORRECT CHANNEL: B737_AIRCRAFT_1CHANNEL
        const channel = interaction.guild.client.channels.cache.get(process.env.CHARTERS_AIRLINEROPS_CHANNEL)//CORRECT CHANNEL: CHARTERS_AIRLINEROPS_CHANNEL
        const airline = interaction.options.getString('airline-code')
        const type = interaction.options.getString('aircraft-type')
        const tail = interaction.options.getString('tail-number')
        const start = interaction.options.getString('starting-icao')
        const end = interaction.options.getString('ending-icao')
        const etdstart = interaction.options.getInteger('booking-begins')
        const etdends = interaction.options.getInteger('booking-ends')
        const comments = interaction.options.getString('comments')
        const commentembed = new MessageEmbed()
            .setAuthor({name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTitle(`Aircraft Booking for ${airline.toUpperCase()}`)
            .setColor('0X37B6FF')
            .addFields({
                name: 'Booking Details',
                value: `**Aircraft Type:** ${type.toUpperCase()}\n**Aircraft Tail Number:** ${tail.toUpperCase()} \n**Starting Airport:**   ${start.toUpperCase()}\n**Ending Airport:**   ${end.toUpperCase()} \n**Booking Begins:**  ${etdstart}z\n**Booking Ends:** ${etdends}z \n**Any comments the member had:**    ${comments}`
            })
            .setTimestamp()
            .setFooter({text: 'Made by The Pilot Club For TPC Charters'});
        const nocommentembed = new MessageEmbed()
            .setAuthor({name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTitle(`Aircraft Booking for ${airline.toUpperCase()}`)
            .setColor('0X37B6FF')
            .addFields({
                name: 'Booking Details',
                value: `**Aircraft Type:** ${type.toUpperCase()} \n**Aircraft Tail Number:** ${tail.toUpperCase()}\n **Starting Airport:**   ${start.toUpperCase()} \n**Ending Airport:**   ${end.toUpperCase()} \n**Booking Begins:**  ${etdstart}z\n**Booking Ends:** ${etdends}z`
            })
            .setTimestamp()
            .setFooter({text: 'Made by The Pilot Club For TPC Charters'});
        if (interaction.member.roles.cache.some(role => role.name === 'TPC Charters')) {
            if (comments !== null) {
                if (tail == process.env.A320_AIRCRAFT_1U) {
                    a3201channel.send({content: `<@&910012872246046730>`, embeds: [commentembed]})
                } else if (tail == process.env.A320_AIRCRAFT_1L) {
                    a3201channel.send({content: `<@&910012872246046730>`, embeds: [commentembed]})
                } else if (tail == process.env.B737_AIRCRAFT_1U) {
                    b7371channel.send({content: `<@&910012872246046730>`, embeds: [commentembed]})
                } else if (tail == process.env.B737_AIRCRAFT_1L) {
                    b7371channel.send({content: `<@&910012872246046730>`, embeds: [commentembed]})
                } else if (tail == process.env.A320_AIRCRAFT_2L) {
                    a3202channel.send({content: `<@&910012872246046730>`, embeds: [commentembed]})
                } else if (tail == process.env.A320_AIRCRAFT_2U) {
                    a3202channel.send({content: `<@&910012872246046730>`, embeds: [commentembed]})
                } else {
                    channel.send({content: `<@&910012872246046730>`, embeds: [commentembed]})
                }

            } else {
                if (tail == process.env.A320_AIRCRAFT_1U) {
                    a3201channel.send({content: `<@&910012872246046730>`, embeds: [nocommentembed]})
                } else if (tail == process.env.A320_AIRCRAFT_1L) {
                    a3201channel.send({content: `<@&910012872246046730>`, embeds: [nocommentembed]})
                } else if (tail == process.env.B737_AIRCRAFT_1U) {
                    b7371channel.send({content: `<@&910012872246046730>`, embeds: [nocommentembed]})
                } else if (tail == process.env.B737_AIRCRAFT_1L) {
                    b7371channel.send({content: `<@&910012872246046730>`, embeds: [nocommentembed]})
                } else if (tail == process.env.A320_AIRCRAFT_2L) {
                    a3202channel.send({content: `<@&910012872246046730>`, embeds: [nocommentembed]})
                } else if (tail == process.env.A320_AIRCRAFT_2U) {
                    a3202channel.send({content: `<@&910012872246046730>`, embeds: [nocommentembed]})
                } else {
                    channel.send({content: `<@&910012872246046730>`, embeds: [nocommentembed]})
                }
            }
            await interaction.reply({content: `Your Booking has been submitted! Thank you!`, ephemeral: true})
        } else {
            interaction.reply({
                content: `You do not have the TPC Charters Role! Go to #about-and-sop to learn more!`,
                ephemeral: true
            })
        }
    }
}    