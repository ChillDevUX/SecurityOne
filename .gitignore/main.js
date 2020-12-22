// const { kMaxLength } = require('buffer');
const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client();
const { readdirSync } = require('fs');
const mongoose = require('mongoose');
const { DBCONNECTION } = require('./config.js')

init: () => {
    const mongOptions = {
        
    }
}

// const config = require('config.json')
// const db = require('db.json');
["commands", "cooldowns"].forEach(x => client[x] = new Collection())
// CONFIG PREFIX + TOKEN

const { TOKEN, PREFIX } = require('./config');

client.on('ready', async () => {
    console.log('Le bot est online !')
    client.user.setActivity(`amuser les utilisateurs`)
})

client.on('message', message => {
    if(message.content.startsWith('Salut')){
        message.react('🖐️');
    }
    if(message.content.startsWith('salut')){
        message.react('🖐️');
    }
    if(message.content.startsWith('bonjour')){
        message.react('🖐️');

    }
    if(message.content.startsWith('Bonjour')){
        message.react('🖐️');

    }
    if(message.content.startsWith('Hey')){
        message.react('🖐️');

    }
    if(message.content.startsWith('hey')){
        message.react('🖐️');

    }
})

client.on('message', message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return
    const args = message.content.slice(PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
    console.log(client.commands)

    if (!command) return;

    // if (command.help.isUserAdmin && !user) return message.reply('Il faut mentionner un utilisateur. ')
    if (command.help.isUserAdmin && message.guild.member(message.mentions.users.first()).hasPermissions('BAN_MEMBERS')) return message.reply("Tu ne peux pas utiliser cette commande sur cet utilisateur !")






    if (command.help.permissions && !message.member.hasPermission('BAN_MEMBERS')) return message.reply("Tu n'as pas les permissions pour executer cette commande !").then(message => message.react('😬'))

    
    if (command.help.args && !args.length) {
        let noArgsReply = `Il nous faut des arguments pour cette commande, ${message.author} ! `

        if (command.help.usage) noArgsReply += `\nVoici comment utiliser la commande : \`${PREFIX}${command.help.name} ${command.help.usage}\``

        return message.channel.send(noArgsReply)
    }

//     if (command.help.args && !args.length) {
//         let noArgsReply = new MessageEmbed()
//         .setTitle(`Il nous faut des arguments pour cette commande ${message.author} !`)

//         if (command.help.usage) noArgsReply += new MessageEmbed()
//         .setDescription(`\nVoici comment utiliser la commande : \`${PREFIX}${command.help.name} ${command.help.usage}\``)
//         .setColor('#EC3904')
//         .setFooter('SecurityOne vous aide pour tout !')
// message.channel.send(NoArgsReply)
//     }

    if (!client.cooldowns.has(command.help.name)){
        client.cooldowns.set(command.help.name, new Collection());
    }

    const timeNow = Date.now();
    const tStamps = client.cooldowns.get(command.help.name);
    const cdAmount = (command.help.cooldown || 5) * 1000;

    console.log(client.cooldowns)

    if (tStamps.has(message.author.id)){
        const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

        if(timeNow < cdExpirationTime){
            timeLeft = (cdExpirationTime - timeNow) / 1000;
            return message.reply(`Merci d'attendre ${timeLeft.toFixed(0)} secondes avant de ré-utiliser la commande \`${command.help.name}\`. `)
        }
    }

    tStamps.set(message.author.id, timeNow);
    setTimeout(() => tStamps.delete(message.author.id), cdAmount)


    command.run(client, message, args)
});

const loadCommands = (dir = "./commands/") => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

        for (const file of commands) {
            const getFileName = require(`${dir}/${dirs}/${file}`);
            client.commands.set(getFileName.help.name, getFileName);
            console.log(`Commande chargée : ${getFileName.help.name}`);
        };
    });
};

loadCommands();


client.on('guildMemberAdd', async(member) => { // this event gets triggered when a new member joins the server!
    // Firstly we need to define a channel
    // either using .get or .find, in this case im going to use .get()
    const Channel = member.guild.channels.cache.get('789168821394341939') //insert channel id that you want to send to
    //making embed
    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Nouveau Membre !')
        .setDescription(`**${member.displayName}** bienvenue sur ${member.guild.name}, tu es le ${member.guild.memberCount} membre !`)
    // sends a message to the channel
    Channel.send(embed)
})
client.on('guildMemberRemove', async(member) => { // this event gets triggered when a new member leaves the server!
    // Firstly we need to define a channel
    // either using .get or .find, in this case im going to use .get()
    const Channel = member.guild.channels.cache.get('789168821394341939') //insert channel id that you want to send to
    //making embed
    const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Un membre vient de quitter le serveur :(')
        .setDescription(`**${member.displayName}** a quitté ${member.guild.name}, nous sommes maintenant ${member.guild.memberCount} membres !`)
    // sends a message to the channel
    Channel.send(embed)
})

client.login(process.env.TOKEN)
