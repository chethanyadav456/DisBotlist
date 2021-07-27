const app = require('express').Router();
const db = require("../../database/models/servers/server.js");
const client = global.clientSL;
const channels = global.config.server.channels;

console.log("[disbots.xyz/servers]: Add Server router loaded.");

app.get("/add", global.checkAuth, async (req,res) => {
  if(!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id)) return res.redirect("/error?code=403&message=To do this, you have to join our discord server.");
    res.render("servers/add.ejs", {
        bot: global.clientSL,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles:global.config.server.roles,
        channels: global.config.server.channels
	})
})
app.post("/add", global.checkAuth, async (req,res) => {
    let { guildID, link, autoCreate, shortDesc, longDesc, tags } = req.body;
    const guild = client.guilds.cache.get(req.body.guildID);
    let checkGuild = await db.findOne({ id: guildID });
    if(checkGuild) return res.send({ error: true, message: "This server already exist system." });
    if(!guildID || !longDesc || !shortDesc || !tags) return res.send({ error: true, message: "Fill the must any blanks."});
    if(!link && !autoCreate) return res.send({ error: true, message: "Fill the must any blanks."});
    if (!guild) return res.send({ error: true, message: "You have to add me to that server first." });
    const member = guild.members.cache.get(req.user.id);
    if(!member){
      try{ await guild.members.fetch();
        member = guild.members.cache.get(req.user.id);
      } catch (err) {
      	res.send({ error: true, message: `Couldn't fetch the members of ${guild.id}: ${err}`})
      }
    }
    if (!member) return res.send({ error: true, message: "You can only add servers with ADMINISTRATOR authorization." });
    if (!member.permissions.has("ADMINISTRATOR")) return res.send({ error: true, message: "You can only add servers with ADMINISTRATOR authorization." });
    await db.findOneAndUpdate({
        id: req.body.guildID
    }, {
        $set: {
        id: guild.id,
    		name: guild.name,
        status: "Approved",
        premium: "None",
    		icon: guild.iconURL({ dynamic: true }),
    		ownerID: guild.owner.id ? guild.owner.id : req.user.id,
    		longDesc: req.body.longDesc,
    		shortDesc: req.body.shortDesc,
    		tags: req.body.tags,
    		votes: 0
        }
    }, { upsert: true })
    if(autoCreate === "true") {
    guild.fetchInvites().then(async fetchinvite => {
      fetchinvite.array().find(a => a.inviter.id === client.user.id)
        ? fetchinvite.array().find(a => a.inviter.id === client.user.id).code
        : await guild.channels.cache.random().createInvite({ maxAge: 0 });
    });
    guild.fetchInvites().then(async fetchinvite => {
      let inviteURL = fetchinvite
        .array()
        .find(a => a.inviter.id === client.user.id).url;
    await db.findOneAndUpdate({
        id: guild.id
    }, {
        $set: {
            link: inviteURL
        }
    }, { upsert: true })
    })

    } else {
    await db.findOneAndUpdate({
        id: guild.id
    }, {
        $set: {
            link: req.body.link
        }
    }, { upsert: true })
    }
    let clientguild = client.guilds.cache.get(global.config.server.id)
    clientguild.members.cache.get(botdata.ownerID).roles.add(global.config.server.roles.botlist.ownerserver);
    client.channels.cache.get(global.config.server.channels.botlog).send(`<:add:853596640824655872> <@${req.user.id}> added **${guild.name}** \n https://disbots.xyz/server/${a.id}/`)
    return res.send({ success: true, message: "Server succesfuly added." });
})

module.exports = app;
