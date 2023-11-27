const { Client, MessageButton, MessageEmbed, Intents } = require('discord.js');



const categoryId = '1125244473945882725';
const allowedRoleId = '1125585196125790239';
const adminRoleId = '1125585196125790239';
const channelId = '1125245648829173882';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const userTickets = {};

client.on('ready', () => {
    console.log(`
███████╗████████╗ █████╗ ██████╗ ████████╗
██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝
███████╗   ██║   ███████║██████╔╝   ██║   
╚════██║   ██║   ██╔══██║██╔══██╗   ██║   
███████║   ██║   ██║  ██║██║  ██║   ██║   
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
                                          
`);
    console.log("Bot starting Succes")
    client.user.setPresence({
        status: 'dnd', // Rahatsız Etmeyin 
        activities: [{ name: 'Ramzy Shoping 💸', type: 'WATCHING' }], //Aktivite 
    });
});

let ticketCount = 0;

client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '.panelticket') {
        const button = new MessageButton()
            .setCustomId('create_ticket')
            .setLabel('Ticket ')
            .setEmoji("<a:1090281733963927632:1127776106209091635>  ")
            .setStyle('PRIMARY');

        const embed = new MessageEmbed()
            .setColor('#313335')
            .setTitle('Ticket System <a:1112385023606280343:1126247489410977903>  ')
            .setDescription('> <:Ate:1130694394740228147> · **this is the Ramzy shop ticket system by opening ticket you can solve your doubts and make your purchases**!')
            .setImage('https://cdn.discordapp.com/attachments/1125245648829173882/1148723127518503042/NEALOGO.png')
            .setURL("https://rraamzyy.mysellix.io/")
            .setAuthor("Ticket system by Ntzk")
        
        
        message.channel.send({
            embeds: [embed],
            components: [{ type: 'ACTION_ROW', components: [button] }],
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const member = interaction.member;
        if (!member) return;

        // Verificar si el usuario ya tiene un ticket abierto
        if (userTickets[member.id]) {
            interaction.reply({
                content: 'Ya tienes un ticket abierto. No puedes abrir otro.',
                ephemeral: true,
            });
            return;
        }

        const guild = interaction.guild;
        if (!guild) return;

        const category = guild.channels.cache.get(categoryId);
        if (!category || category.type !== 'GUILD_CATEGORY') return;

        const allowedRole = guild.roles.cache.get(allowedRoleId);
        if (!allowedRole) return;

        const adminRole = guild.roles.cache.get(adminRoleId);
        if (!adminRole) return;

        ticketCount++;
        const ticketChannelName = `ticket-${ticketCount}`;

        guild.channels
            .create(ticketChannelName, {
                type: 'GUILD_TEXT',
                parent: category,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: member.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: allowedRole.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: adminRole.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                    },
                ],
            })
            .then((channel) => {
                const closeButton = new MessageButton()
                    .setCustomId('close_ticket')
                    .setLabel('Ticket Close')
                    .setEmoji("<:Ate:1130694394740228147> ")
                    .setStyle('DANGER');

                const embed = new MessageEmbed()
                    .setColor('#0200ff')
                    .setTitle("Hello you ticket support!")
                    .setDescription(`Ticket From: ${member} <:ayuda:1118342367704006717> `)
                    .setFooter('Ticket System');
                embed.setThumbnail("https://cdn.discordapp.com/attachments/1125245648829173882/1146001241957224538/ramzninho.png");
                channel.send({
                    content: `<@${member.id}> / @everyone  <a:1090281733963927632:1127776106209091635>  `,
                    embeds: [embed],
                    components: [{ type: 'ACTION_ROW', components: [closeButton] }],
                });

                interaction.reply({
                    content: `Ticket Channel: ${channel}`,
                    ephemeral: true,
                });

                // Registrar que el usuario tiene un ticket abierto
                userTickets[member.id] = true;
            })
            .catch((error) => {
                console.error('An error occurred while creating a ticket:', error);
                interaction.reply({
                    content: 'An error occurred while creating a ticket',
                    ephemeral: true,
                });
            });
    } else if (interaction.customId === 'close_ticket') {
        const channel = interaction.channel;
        if (!channel) return;

        channel.delete().catch((error) => {
            console.error('An error occurred while closing the ticket:', error);
            interaction.reply({
                content: 'An error occurred while closing the ticket.',
                ephemeral: true,
            });

            // Registrar que el usuario no tiene más tickets abiertos
            userTickets[interaction.member.id] = false;
        });
    }
});

  
  

client.login(config.token);