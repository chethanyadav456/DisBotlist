const Discord = require('discord.js');
const c = require("../settings.json");
const fetch = require("node-fetch");
exports.run = (client, message, args) => {
    if(!c.owner.includes(message.author.id)) return  message.reply('could not be granted access permission.')
	message.channel.send("DisBot: bot is restarting. ").then(msg => {
		console.log(`BOT : Rebooting...`);
		process.exit(1);
	})
};
exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'reboot',
	description: 'Restarts the Bot.',
	usage: 'reboot'
};